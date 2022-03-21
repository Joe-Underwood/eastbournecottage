from app import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)

import click
from app.methods import update_price_list, update_billings

@app.cli.command()
def updatepricelist():
    """Update range_type of Price_List segments and add new future segments"""
    update_price_list()
    click.echo('Price_List_Updated')

@app.cli.command()
def updatebillings():
    """Update Billing table and send invoices out for progressive billings"""
    update_billings()
    click.echo('Billing updated')
    
@app.cli.command()
def testupdatebillings():
    """Send preview of invoices to be sent to admin"""
    update_billings()
    click.echo('Previews sent')