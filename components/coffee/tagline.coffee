$ = require 'jquery'

do fill = (item = 'The MOST creative minds in Art!!!') ->
  $('.tagline').append "#{item}"
fill