from pydantic import BaseModel, validator, PositiveInt
from annotated_types import Len
from typing import Literal, Optional, Annotated, Union

APPLICATION_DRAFT = 0
APPLICATION_IN_REVIEW = 1
APPLICATION_REJECTED = 2
APPLICATION_APPROVED = 3
# TODO: put constants here for veteran status once decided

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
    answerType: str
    minCharsNum: PositiveInt
    maxCharsNum: PositiveInt
    isMultipleLines: bool

class NumberOptions(BaseModel):
    isIntegerOnly: bool
    minNum: Union[int, float]
    maxNum: Union[int, float]


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
    date: str

class FileAnswer(BaseModel):
    options: FileOptions
    type: str


"""
Grant Model
"""
class GrantBase(BaseModel):
    grantorEmail: str
    title: str
    description: str
    numWinners: int
    maxWinners: int
    deadline: str # maybe change to str for simplicity
    isActive: bool
    amountPerApp: float
    profileReqs: UserProfileReqs # test later

class Grant(GrantBase):
   winnerIDs: list[str]
   appliedIDs: list[str]
   questionData: list[Question]


"""
Application Model
"""
class Application(BaseModel):
    grantID: str
    email: str
    dateSubmitted: str  # maybe str
    status: int
    # profileData: UserProfile | None = UserProfile()  # test later; remove optional after done
    profileData: UserProfile
    answerData: list[Union[
        TextboxAnswer,
        NumberAnswer,
        MultipleChoiceAnswer,
        CheckboxAnswer,
        DateAnswer,
        FileAnswer
    ]]
