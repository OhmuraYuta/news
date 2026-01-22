FROM python:3.14
WORKDIR /workdir/api

RUN apt-get update &&\
    apt-get -y install\
    locales\
    curl\
    git\
    postgresql-client\
    bash-completion &&\
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=JST-9

RUN pip install --upgrade pip

RUN curl -sSL https://install.python-poetry.org | python -
ENV PATH=/root/.local/bin:$PATH
RUN poetry config virtualenvs.in-project true

RUN curl -o /root/.git-completion.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN curl -o /root/.git-prompt.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh

# COPY ./api/pyproject.toml ./
COPY ./api/pyproject.toml ./api/poetry.lock ./
COPY docker/api/.extra_bashrc /root/.extra_bashrc
RUN echo "source /root/.extra_bashrc" >> /root/.bashrc
RUN poetry install --no-root

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--loop", "asyncio"]