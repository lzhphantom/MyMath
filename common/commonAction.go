package common

import "crypto/md5"

func MD5Password(pwd string) [16]byte {
	pwdData := []byte(pwd)
	has := md5.Sum(pwdData)
	return has
}
