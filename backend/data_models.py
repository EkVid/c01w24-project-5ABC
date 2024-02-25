from pydantic import BaseModel, validator, PositiveInt
from annotated_types import Len
from typing import Literal, Optional, Annotated, Union

"""
Grant Model
"""
class Grant(BaseModel):
    grantorID: int
    grantName: str
    quantity: PositiveInt

"""
Question Option and Question Models
"""
class TextboxOptions(BaseModel):
    answerType: str
    minCharsNum: PositiveInt
    maxCharsNum: PositiveInt
    isMultipleLines: bool

class NumberOptions(BaseModel):
    isIntegerOnly: bool
    minNum: Union[int, float]
    maxNum: Union[int, float]

    @validator('minNum', 'maxNum', always=True)
    def validate_range(cls, value, values):
        if values['isIntegerOnly']:
            assert(type(value) == int)
        else:
            assert(type(value) == float)


class MultipleChoiceOptions(BaseModel): 
    answers: Annotated[list[str], Len(min_length=2, max_length=10)]

class CheckboxOptions(BaseModel):
    answers: Annotated[list[str], Len(min_length=1, max_length=10)]
    isNoneAnOption: bool

class DateOptions(BaseModel):
    isDateRange: bool
    isBothRequired: bool

class FileOptions(BaseModel):
    type: str

class Question(BaseModel):
    question: str
    type: Literal['textbox', 'number', 'multiple choice', 'checkbox', 'date', 'file']
    isRequired: bool
    options: Union[
        TextboxOptions,
        NumberOptions,
        MultipleChoiceOptions,
        CheckboxOptions,
        DateOptions,
        FileOptions
    ]

"""
Form Model
"""
class Form(BaseModel):
    grantID: int
    grantorID: int
    grantName: str
    questionData: list[Question]
