type Success<TResult> = {
	success: true;
	result: TResult
}

type SuccessNoResult = {
	success: true;
}

type NoSuccess<TReason> = {
	success: false;
	reason: TReason;
}

/* Base result type. */
type Result<TResult, TReason> = Success<TResult> | NoSuccess<TReason>;

/* Result with string error. */
type ResultMessage<TResult> = Result<TResult, string>

/* Result which returns nothing */
type ResultAction<TReason> = SuccessNoResult | NoSuccess<TReason>;
