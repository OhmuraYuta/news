FROM php:8.2-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    bash-completion \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install gd pdo_mysql mbstring exif opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN curl -o /root/.git-completion.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN curl -o /root/.git-prompt.sh https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh

COPY docker/backend/.extra_bashrc /root/.extra_bashrc
RUN echo "source /root/.extra_bashrc" >> /root/.bashrc

CMD ["php-fpm"]