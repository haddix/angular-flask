
def get_table():
    rows = [
        {"name": 'Jason', "gender": 'Male', "company": 'Swimlane'},
        {"name": 'Anthony', "gender": 'Male', "company": 'KFC'},
    ];
    columns = [{"prop": 'name'}, {"name": 'Gender'}, {"name": 'Company'}];

    table = {"rows": rows, "columns":columns}

    return table