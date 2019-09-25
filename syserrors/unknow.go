package syserrors

type UnknowError struct {
	msg    string
	reason error
}

func (err UnknowError) Error() string {
	if len(err.msg) == 0 {
		return "未知错误"
	}
	return err.msg
}

func (err UnknowError) Code() int {
	return 1000
}

func (err UnknowError) ReasonError() error {
	return err.reason
}
