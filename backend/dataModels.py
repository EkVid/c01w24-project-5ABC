from pydantic import BaseModel, validator, PositiveInt
from annotated_types import Len
from typing import Literal, Optional, Annotated, Union
from datetime import date

"""
User Profile Models
"""
class UserProfileReqs(BaseModel):
    minAge: Optional[int]
    maxAge: Optional[int]
    race: Optional[list[str]]
    gender: Optional[list[str]]
    canadianCitizen: Optional[int]
    veteran: Optional[int]

class UserProfile(BaseModel):
    age: int
    race: list[str]
    gender: str
    canadianCitizen: int
    veteran: int


"""
Grant Model
"""
class GrantBase(BaseModel):
    grantID: int
    grantorName: str
    title: str
    description: str
    numWinnners: int
    maxWinners: int
    deadline: str # maybe change to str for simplicity
    isActive: bool
    amountPerApp: float
    profileReqs: UserProfileReqs

class Grant(GrantBase):
   winnerIDs: list[int]
   appliedIDs: list[int]
   formID: int


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

class Question(BaseModel):  # TODO: implement phone number and email options if needed
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
Answer Models
"""
class TextboxAnswer(BaseModel):
    options: TextboxOptions
    text: str
    
    @validator('text', always=True)
    def validate_text_box(cls, value, values) -> str:
        minChars = values['options'].minCharsNum
        maxChars = values['options'].maxCharsNum
        inRange = minChars <= len(value) and len(value) <= maxChars
        assert(inRange == True)

class NumberAnswer(BaseModel):
    num: Union[int, float]
    options: NumberOptions

class MultipleChoiceAnswer(BaseModel):
    answers: Annotated[list[str], Len(min_length=1)]
    options: MultipleChoiceOptions

class CheckboxAnswer(BaseModel):
    answers: Annotated[list[str], Len(min_length=1)]
    options: CheckboxOptions

class DateAnswer(BaseModel):
    date: str
    options:DateOptions

class FileAnswer(BaseModel):
    type: str
    options: FileOptions


"""
Application Model
"""
class Application(BaseModel):
    applicationID: int
    grantID: str
    email: str
    dateSubmitted: str  # maybe str
    status: int
    #profileData: UserProfile | None = UserProfile()  # remove optional after done
    answerData: list[Union[
        TextboxAnswer,
        NumberAnswer,
        MultipleChoiceAnswer,
        CheckboxAnswer,
        DateAnswer,
        FileAnswer
    ]]


"""
Form Model
"""
class Form(BaseModel):
    formID: int
    grantID: int
    questionData: list[Question]
