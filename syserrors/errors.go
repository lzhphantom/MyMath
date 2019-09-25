package syserrors

type Error interface {
	Error() string
	Code() int
	ReasonError() error
}

func NewError(msg string, err2 error) UnknowError {
	err := UnknowError{
		msg,
		err2,
	}
	return err
}
