import click

def cprint(*args, color = 'green'):
    click.secho(", ".join(map(lambda x: str(x), args)), fg=color)
