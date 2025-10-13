import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { logger } from '../utils/logger';

class IPFSManager {
  private client: IPFSHTTPClient | null = null;
  private gateways: string[] = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
  ];

  async connect(): Promise<void> {
    try {
      const ipfsNodeUrl = process.env.IPFS_NODE_URL || 'http://localhost:5001';
      this.client = create({ url: ipfsNodeUrl });
      
      // Test connection
      const version = await this.client.version();
      logger.info(`Connected to IPFS node: ${version.version}`);
    } catch (error) {
      logger.error('Failed to connect to IPFS:', error);
      throw error;
    }
  }

  async uploadFile(file: Buffer, options?: { pin?: boolean; chunker?: string }): Promise<string> {
    if (!this.client) {
      throw new Error('IPFS client not connected');
    }

    try {
      const result = await this.client.add(file, {
        pin: options?.pin ?? true,
        chunker: options?.chunker ?? 'rabin',
        rabin: { avgChunkSize: 1024 * 1024 }, // 1MB chunks
      });

      logger.info(`File uploaded to IPFS: ${result.cid.toString()}`);
      return result.cid.toString();
    } catch (error) {
      logger.error('Failed to upload file to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<string> {
    if (!this.client) {
      throw new Error('IPFS client not connected');
    }

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const result = await this.client.add(jsonString, {
        pin: true,
      });

      logger.info(`JSON uploaded to IPFS: ${result.cid.toString()}`);
      return result.cid.toString();
    } catch (error) {
      logger.error('Failed to upload JSON to IPFS:', error);
      throw error;
    }
  }

  async getFile(hash: string): Promise<Buffer> {
    if (!this.client) {
      throw new Error('IPFS client not connected');
    }

    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error(`Failed to get file from IPFS: ${hash}`, error);
      throw error;
    }
  }

  async getJSON(hash: string): Promise<any> {
    try {
      const buffer = await this.getFile(hash);
      return JSON.parse(buffer.toString());
    } catch (error) {
      logger.error(`Failed to get JSON from IPFS: ${hash}`, error);
      throw error;
    }
  }

  async pinContent(hash: string): Promise<void> {
    if (!this.client) {
      throw new Error('IPFS client not connected');
    }

    try {
      await this.client.pin.add(hash);
      logger.info(`Content pinned: ${hash}`);
    } catch (error) {
      logger.error(`Failed to pin content: ${hash}`, error);
      throw error;
    }
  }

  async unpinContent(hash: string): Promise<void> {
    if (!this.client) {
      throw new Error('IPFS client not connected');
    }

    try {
      await this.client.pin.rm(hash);
      logger.info(`Content unpinned: ${hash}`);
    } catch (error) {
      logger.error(`Failed to unpin content: ${hash}`, error);
      throw error;
    }
  }

  getOptimalGateway(hash: string): string {
    // For now, return the first gateway
    // In production, this should test gateway performance
    return this.gateways[0] + hash;
  }

  async testGateway(gateway: string): Promise<{ gateway: string; responseTime: number }> {
    const startTime = Date.now();
    try {
      const response = await fetch(gateway, { method: 'HEAD' });
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        return { gateway, responseTime };
      } else {
        throw new Error(`Gateway returned ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Gateway test failed: ${error}`);
    }
  }

  async getOptimalGatewayAsync(hash: string): Promise<string> {
    try {
      const results = await Promise.allSettled(
        this.gateways.map(gateway => this.testGateway(gateway + hash))
      );

      const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<{ gateway: string; responseTime: number }>).value)
        .sort((a, b) => a.responseTime - b.responseTime);

      if (successfulResults.length > 0) {
        return successfulResults[0].gateway;
      } else {
        // Fallback to first gateway
        return this.gateways[0] + hash;
      }
    } catch (error) {
      logger.error('Failed to find optimal gateway:', error);
      return this.gateways[0] + hash;
    }
  }

  async ensureAvailability(hash: string): Promise<void> {
    try {
      // Pin content to ensure availability
      await this.pinContent(hash);
      
      // Test that content is accessible
      const gateway = await this.getOptimalGatewayAsync(hash);
      await this.testGateway(gateway);
      
      logger.info(`Content availability ensured: ${hash}`);
    } catch (error) {
      logger.error(`Failed to ensure content availability: ${hash}`, error);
      throw error;
    }
  }
}

export const ipfsManager = new IPFSManager();

export async function connectIPFS(): Promise<void> {
  await ipfsManager.connect();
}
