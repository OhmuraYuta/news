FROM php:8.4-fpm

WORKDIR /workdir/backend

RUN apt-get update && apt-get install -y \
    git \
    zip \
    curl \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    bash-completion \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo_mysql mbstring bcmath gd 

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN curl -o /root/.git-completion.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN curl -o /root/.git-prompt.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh

COPY docker/backend/.extra_bashrc /root/.extra_bashrc
RUN echo "source /root/.extra_bashrc" >> /root/.bashrc

CMD ["php-fpm"]