import Foundation
import Security

enum SignerError: Error { case keyCreation, keyLookup, signing, invalidInput }

let tag = "ai.epercent.eos.bridge.approval-key".data(using: .utf8)!

func privateKey() throws -> SecKey {
    let query: [String: Any] = [
        kSecClass as String: kSecClassKey,
        kSecAttrApplicationTag as String: tag,
        kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
        kSecReturnRef as String: true
    ]
    var item: CFTypeRef?
    if SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess,
       let key = item as! SecKey? { return key }

    var error: Unmanaged<CFError>?
    let access = SecAccessControlCreateWithFlags(
        nil,
        kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
        [.privateKeyUsage, .userPresence],
        &error
    )
    guard let access else { throw SignerError.keyCreation }
    let attributes: [String: Any] = [
        kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
        kSecAttrKeySizeInBits as String: 256,
        kSecPrivateKeyAttrs as String: [
            kSecAttrIsPermanent as String: true,
            kSecAttrApplicationTag as String: tag,
            kSecAttrAccessControl as String: access
        ]
    ]
    guard let key = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
        throw SignerError.keyCreation
    }
    return key
}

func publicKeyPEM(_ key: SecKey) throws -> String {
    guard let publicKey = SecKeyCopyPublicKey(key),
          let data = SecKeyCopyExternalRepresentation(publicKey, nil) as Data? else {
        throw SignerError.keyLookup
    }
    let spkiPrefix = Data([
        0x30,0x59,0x30,0x13,0x06,0x07,0x2A,0x86,0x48,0xCE,0x3D,0x02,0x01,
        0x06,0x08,0x2A,0x86,0x48,0xCE,0x3D,0x03,0x01,0x07,0x03,0x42,0x00
    ])
    let body = (spkiPrefix + data).base64EncodedString(options: [.lineLength64Characters])
    return "-----BEGIN PUBLIC KEY-----\n" + body + "\n-----END PUBLIC KEY-----\n"
}

let arguments = CommandLine.arguments
guard arguments.count >= 2 else { throw SignerError.invalidInput }
let key = try privateKey()

if arguments[1] == "public-key" {
    print(try publicKeyPEM(key), terminator: "")
} else if arguments[1] == "sign" {
    let payload = FileHandle.standardInput.readDataToEndOfFile()
    var error: Unmanaged<CFError>?
    guard let signature = SecKeyCreateSignature(
        key,
        .ecdsaSignatureMessageX962SHA256,
        payload as CFData,
        &error
    ) as Data? else { throw SignerError.signing }
    print(signature.base64EncodedString())
} else {
    throw SignerError.invalidInput
}
