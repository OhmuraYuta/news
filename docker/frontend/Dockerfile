FROM node:20
WORKDIR /workdir

RUN apt-get update &&\
    apt-get -y install\
    locales\
    curl\
    git\
    bash-completion \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config &&\
    rm -rf /var/lib/apt/lists/* &&\
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=JST-9

RUN curl -o /root/.git-completion.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN curl -o /root/.git-prompt.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh

COPY docker/frontend/.extra_bashrc /root/.extra_bashrc
RUN echo "source /root/.extra_bashrc" >> /root/.bashrc

WORKDIR /workdir/frontend

COPY frontend/package*.json ./
RUN npm ci

CMD ["npm", "run", "dev"]