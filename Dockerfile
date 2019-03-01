FROM ruby

WORKDIR /usr/local/src/gh-pages
ADD Gemfile .
RUN gem install bundler \
      && bundle

EXPOSE 4000
CMD bundle exec jekyll serve
