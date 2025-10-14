import { IPFSUploadService } from '../IPFSUploadService'

describe('IPFSUploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('exposes gateways and allows add/remove', () => {
    const svc = new IPFSUploadService()
    const startLen = svc.getGateways().length
    svc.addGateway('https://example.com/api/v0')
    expect(svc.getGateways().length).toBe(startLen + 1)
    svc.removeGateway('https://example.com/api/v0')
    expect(svc.getGateways().length).toBe(startLen)
  })

  it('validates file types and sizes', async () => {
    const svc = new IPFSUploadService()
    // @ts-ignore private method via cast for test
    const validate = (svc as any).validateFile.bind(svc)
    expect(() => validate(new File(['x'], 'a.mp3', { type: 'audio/mpeg' }))).not.toThrow()
    expect(() => validate(new File([''], 'empty.mp3', { type: 'audio/mpeg' }))).toThrow()
    expect(() => validate(new File(['x'], 'bad.txt', { type: 'text/plain' }))).toThrow()
  })
})


