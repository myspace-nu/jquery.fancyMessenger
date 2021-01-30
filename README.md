# jQuery.fancyMessenger

A simple jQuery plugin for creating a website messenger.

[![Build Status](https://travis-ci.com/myspace-nu/jquery.fancyMessenger.svg?branch=main)](https://travis-ci.com/myspace-nu/jquery.fancyMessenger)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/myspace-nu/jquery.fancyMessenger/blob/master/LICENSE)

## Live demo

See a live demo on [CodePen](https://codepen.io/myspace-nu/pen/mdOdYQe)

## Installation

Using npm

	npm install jquery.fancymessenger --save

Using CDN

	<script src="https://cdn.jsdelivr.net/npm/jquery.fancymessenger/dist/jquery.fancyMessenger.min.js"></script>

Or manually by including the script *after* the jQuery library

	<script src="/path/to/fancyTable.min.js"></script>

## Usage

	<script type="text/javascript">
        $(document).ready(function() {
            $.fancyMessenger({
                onSend:function(obj){
                    // Send your message here.
                    console.log($(obj).find("textarea").val());
                }
            });
        });
	</script>

### Author: [Johan Johansson](https://github.com/myspace-nu)
