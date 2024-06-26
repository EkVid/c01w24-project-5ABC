from pydantic import BaseModel, validator, PositiveInt
from annotated_types import Len
from typing import Literal, Optional, Annotated, Union
from datetime import date
from enum import IntEnum


"""
Constants
"""
class ApplicationStatus(IntEnum):
    DRAFT = 0
    IN_REVIEW = 1
    REJECTED = 2
    APPROVED = 3

# TODO: put constants here for veteran status once decided
class VeteranStatus(IntEnum):
    VETERAN = 0
    NON_VETERAN = 1  # in what case would we want to exclude a veteran from applying?

"""
User Profile Models
"""
class UserProfileReqs(BaseModel):
    # Optional still means you have to pass in these fields but just with None or "", etc
    minAge: Optional[int]
    maxAge: Optional[int]
    race: Optional[list[str]]
    gender: Optional[list[str]]
    nationality: Optional[list[str]]
    veteran: Optional[int]

class UserProfile(BaseModel):
    age: int
    race: str
    gender: str
    nationality: str
    veteran: int


"""
Question Option and Question Models
"""
class TextboxOptions(BaseModel):
    minCharsNum: Optional[PositiveInt] = None
    maxCharsNum: Optional[PositiveInt] = None
    isMultipleLines: Optional[bool] = None

class NumberOptions(BaseModel):
    isIntegerOnly: Optional[bool] = None
    minNum: Optional[Union[int, float]] = None
    maxNum: Optional[Union[int, float]] = None

    @validator('minNum', 'maxNum', always=True)
    def validate_range(cls, value, values) -> Union[int, float]:
        if values['isIntegerOnly']:
            assert(type(value) == int)
        else:
            assert(type(value) == float)

        return value

class MultipleChoiceOptions(BaseModel):
    answers: Annotated[list[str], Len(min_length=2, max_length=10)]

class CheckboxOptions(BaseModel):
    answers: Annotated[list[str], Len(min_length=1, max_length=10)]
    isNoneAnOption: Optional[bool]

class DateOptions(BaseModel):
    isDateRange: Optional[bool] = None
    isBothRequired: Optional[bool] = None

class FileOptions(BaseModel):
    type: str

class Question(BaseModel):
    question: str
    type: Literal['textbox', 'number', 'multiple choice', 'checkbox', 'date', 'file', 'email', 'phone number']
    isRequired: bool
    options: Optional[Union[
        TextboxOptions,
        NumberOptions,
        MultipleChoiceOptions,
        CheckboxOptions,
        DateOptions,
        FileOptions
    ]] = None


"""
Answer Models
"""
class TextboxAnswer(BaseModel):
    options: TextboxOptions
    text: str

    @validator('text', always=True)
    def validate_textbox(cls, value, values):
        # TODO: check that "options" is a valid key and minCharsNum/maxCharsNum are present
        # This would cause an error when attempting to update a non-existent application
        minChars = values['options'].minCharsNum
        maxChars = values['options'].maxCharsNum
        inRange = minChars <= len(value) and len(value) <= maxChars
        assert(inRange == True)

        return value

class NumberAnswer(BaseModel):
    options: NumberOptions
    num: Union[int, float]

    @validator('num', always=True)
    def validate_number(cls, value, values):
        minNum = values['options'].minNum
        maxNum = values['options'].maxNum
        validNum = ((type(value) == type(minNum)) and (minNum <= value <= maxNum))
        assert(validNum == True)

        return value

class MultipleChoiceAnswer(BaseModel):
    options: MultipleChoiceOptions
    selectedChoice: Annotated[list[str], Len(min_length=1, max_length=1)]

class CheckboxAnswer(BaseModel):
    options: CheckboxOptions
    selectedBoxes: list[str]

    @validator('selectedBoxes', always=True)
    def validate_checkbox(cls, value, values):
        if len(value) == 0:
            validAnswer = values['options'].isNoneAnOption
        else:
            validAnswer = True
        assert(validAnswer == True)

        return value

class DateAnswer(BaseModel):
    options: DateOptions
    date: date

class FileAnswer(BaseModel):
    options: FileOptions
    type: str


"""
Grant Model
"""
class GrantBase(BaseModel):
    grantorEmail: str
    Title: str
    Description: str
    NumWinners: int
    MaxWinners: int
    Deadline: date # maybe change to str for simplicity
    PostedDate: date
    Active: bool
    AmountPerApp: float
    profileReqs: UserProfileReqs # test later

class Grant(GrantBase):
   WinnerIDs: list[str]
   AppliedIDs: list[str]
   QuestionData: list[Question]


"""
Application Model
"""
class Application(BaseModel):
    grantID: str
    applicationID: str
    email: str
    dateSubmitted: date
    status: int
    profileData: UserProfile
    answerData: list[Union[
        TextboxAnswer,
        NumberAnswer,
        MultipleChoiceAnswer,
        CheckboxAnswer,
        DateAnswer,
        FileAnswer
    ]]
