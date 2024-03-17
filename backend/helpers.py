import json as JSON

"""Returns the JSON data from the given multipart form data request.
"""
def getJSONData(request):
    contentType = request.headers.get("Content-Type", None)
    if contentType is None or request.headers.get("Content-Type").split(";")[0] != "multipart/form-data":
        return None

    return JSON.loads(request.form.get("jsonData", "null"))


"""Returns True if `listCandidate` is of type list[dict] and False otherwise.
"""
def isListOfDict(listCandidate):
    if not isinstance(listCandidate, list):
        return False

    for dictCandidate in listCandidate:
        if not isinstance(dictCandidate, dict):
            return False

    return True
