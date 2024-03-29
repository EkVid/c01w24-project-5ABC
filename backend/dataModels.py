from pydantic import BaseModel, validator, PositiveInt
from annotated_types import Len
from typing import Literal, Optional, Annotated, Union, Any
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
    NON_VETERAN = 1 

"""
User Profile Models
"""
class UserProfileReqs(BaseModel):
    # Optional still means you have to pass in these fields but just with None or "", etc
    minAge: Optional[int] = None
    maxAge: Optional[int] = None
    race: Optional[list[str]] = None
    gender: Optional[list[str]] = None
    nationality: Optional[list[str]] = None
    veteran: Optional[int] = None

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
        if value == None: return value
        if values['isIntegerOnly']:
            assert(type(value) == int)
        else:
            assert(type(value) == float)

        return value
    

class MultipleChoiceOptions(BaseModel):
    answers: Annotated[list, Len(min_length=2, max_length=10)]

class CheckboxOptions(BaseModel):
    answers: Annotated[list, Len(min_length=1, max_length=10)]
    isNoneAnOption: Optional[bool] = None

class DateOptions(BaseModel):
    isDateRange: Optional[bool] = None
    isBothRequired: Optional[bool] = None

class FileOptions(BaseModel):
    type: str

class Question(BaseModel):
    question: str
    type: Literal['textbox', 'number', 'multiple choice', 'checkbox', 'date', 'file', 'email', 'phone number']
    isRequired: bool
    answersObj: Optional[list] = None
    fileData: Optional[dict] = None
    errEmptyAnsIdxArr: Optional[list] = None
    errDupAnsIdxArr: Optional[list] = None
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
    options: Optional[TextboxOptions] = None
    text: str

    @validator('text', always=True)
    def validate_textbox(cls, value, values):
        if values.get('options', None) == None: return value
        # TODO: check that "options" is a valid key and minCharsNum/maxCharsNum are present
        # This would cause an error when attempting to update a non-existent application
        minChars = values['options'].minCharsNum
        maxChars = values['options'].maxCharsNum
        inRange = minChars <= len(value) and len(value) <= maxChars
        assert(inRange == True)
        return value

class NumberAnswer(BaseModel):
    options: Optional[NumberOptions] = None
    value: Union[int, float]

    @validator('value', always=True)
    def validate_number(cls, value, values):
        if values.get('options', None) == None: return value
        minNum = values['options'].minNum
        maxNum = values['options'].maxNum
        validNum = ((type(value) == type(minNum)) and (minNum <= value <= maxNum))
        assert(validNum == True)

        return value
    

class MultipleChoiceAnswer(BaseModel):
    options: Optional[MultipleChoiceOptions] = None
    answer: Annotated[list[str], Len(min_length=1, max_length=1)]

class CheckboxAnswer(BaseModel):
    options: Optional[CheckboxOptions] = None
    answers: list[str]
    
    @validator('answers', always=True)
    def validate_checkbox(cls, value, values):
        if values.get('options', None) == None: return value
        if len(value) == 0:
            validAnswer = values['options'].isNoneAnOption
        else:
            validAnswer = True
            for el in value:
                if el not in values['options'].answers:
                    validAnswer = False
        assert(validAnswer == True)

        return value
    
    
class EmailAnswer(BaseModel):
    email: str

class PhoneNumAnswer(BaseModel):
    phoneNum: str

class DateAnswer(BaseModel):
    options: Optional[DateOptions] = None
    startDate: Union[str, date] = None
    endDate: Optional[str] = None

class FileAnswer(BaseModel):
    options: Optional[FileOptions] = None
    fileLink: Optional[Any] = None
    fileName: Optional[str] = None


"""
Grant Model
"""
class Grant(BaseModel):
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
    WinnerIDs: list[str]
    AppliedIDs: list[str]
    QuestionData: list[Question]


"""
Application Model
"""
class Application(BaseModel):
    grantID: str
    email: str
    dateSubmitted: Union[str, date]
    status: int
    profileData: Optional[UserProfile] = None
    answers: list[Union[
        TextboxAnswer,
        NumberAnswer,
        MultipleChoiceAnswer,
        CheckboxAnswer,
        EmailAnswer,
        PhoneNumAnswer,
        DateAnswer,
        FileAnswer
    ]]