Instruction
===========

Followed -> http://www.iandevlin.com/blog/2012/11/phonegap/building-an-ios-signing-key-for-phonegap-in-windows

'openssl genrsa -des3 -out ios.key 2048'

pw: euro2016

> openssl req -new -key ios.key -out ios.csr -subj "/emailAddress=czadra@bluewin.ch, CN=cyrillzadra, C=CH"

Uploaded ios.csr on Apple Developer iOS Provisioning Portal

Downloaded ios_development.cer

Generate PEM

> openssl x509 -in ios_development.cer -inform DER -out ios_development.pem -outform PEM

Generate P12

> openssl pkcs12 -export -inkey ios.key -in ios_development.pem -out ios_development.p12

pw: euro2016

Create Provisioning Profile

https://developer.apple.com/account/overview.action