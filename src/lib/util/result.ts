type Result<TResult, TError> = Success<TResult> | NoSuccess<TError>;
type ResultMessage<TResult> = Success<TResult> | NoSuccess<string>;

type Success<TResult> = {
	success: true;
	result: TResult
}

type NoSuccess<TReason> = {
	success: false;
	reason: TReason;
}
