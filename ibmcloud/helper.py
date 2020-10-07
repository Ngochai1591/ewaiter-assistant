def helper(dict):
    if 'name' in dict:
        name = dict['name']
    else:
        name = "stranger"
    greetings = "Hello from helper.py, " + name + "!"
    return {'greetings': greetings}
    