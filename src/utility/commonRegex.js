export const EMAIL_PATTERN =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_PATTERN =
  /^$|^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[!@#$%^&*]).{8,20}$/;
// export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,10}$/;
export const NAME_CHARECTER_PATTERN = /^[a-z A-Z'’]{1,70}$/i;
export const SENTENCE_CHARECTER_PATTERN = /^(\d*[a-zA-Z]+\d*)+.{1,50}$/i;
export const DECIMAL_REGX_AMOUNT = /^\d+(\.\d{1,2})?$/i;
export const FAQ_QUESTION_REGX = /^.{1,100}$/i;
export const FAQ_ANSWER_REGX = /^.{1,500}$/i;
