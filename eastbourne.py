from app import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)

import click
from app.methods import update_price_list

@app.cli.command()
def updatepricelist():
    """Update range_type of Price_List segments and add new future segments"""
    update_price_list()
    click.echo('Price_List_Updated')



