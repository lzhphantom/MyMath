package syserrors

import "github.com/lzhphantom/MyMath/common"

type NotLoginError struct {
	UnknowError
}

func (err NotLoginError) Error() string {
	return "请登录"
}
func (err NotLoginError) Code() int {
	return common.KeyNotLogin
}
