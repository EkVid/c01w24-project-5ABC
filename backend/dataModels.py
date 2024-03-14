from pydantic import BaseModel, validator, PositiveInt
from annotated_types import Len
from typing import Literal, Optional, Annotated, Union
from datetime import date

"""
User Profile Models
"""
class UserProfileReqs(BaseModel):
    # Optional still means you have to pass in these fields but just with None or "", etc
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
    grantorName: str
    title: str
    description: str
    numWinnners: int
    maxWinners: int
    deadline: str # maybe change to str for simplicity
    isActive: bool
    amountPerApp: float
    #profileReqs: UserProfileReqs # test later

class Grant(GrantBase):
   winnerIDs: list[int]
   appliedIDs: list[int]
   questionData: list[Question]


"""
Application Model
"""
class Application(BaseModel):
    grantID: str
    email: str
    dateSubmitted: str  # maybe str
    status: int
    #profileData: UserProfile | None = UserProfile()  # test later; remove optional after done
    answerData: list[Union[
        TextboxAnswer,
        NumberAnswer,
        MultipleChoiceAnswer,
        CheckboxAnswer,
        DateAnswer,
        FileAnswer
    ]]

