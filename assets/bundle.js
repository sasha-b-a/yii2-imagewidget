!function(g){function I(A){if(C[A])return C[A].exports;var n=C[A]={i:A,l:!1,exports:{}};return g[A].call(n.exports,n,n.exports,I),n.l=!0,n.exports}var C={};I.m=g,I.c=C,I.i=function(g){return g},I.d=function(g,C,A){I.o(g,C)||Object.defineProperty(g,C,{configurable:!1,enumerable:!0,get:A})},I.n=function(g){var C=g&&g.__esModule?function(){return g.default}:function(){return g};return I.d(C,"a",C),C},I.o=function(g,I){return Object.prototype.hasOwnProperty.call(g,I)},I.p="",I(I.s=2)}([function(module,exports){eval("// removed by extract-text-webpack-plugin//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsL21haW4uc3R5bD8yMjVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3R5bC9tYWluLnN0eWxcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==")},function(module,exports,__webpack_require__){"use strict";eval("\nexports.__esModule = true;\nvar ImageWidget = (function () {\n    function ImageWidget(dom_id, inputName, images, group, multiply) {\n        var _this = this;\n        this.dom_id = dom_id;\n        this.inputName = inputName;\n        this.images = images;\n        this.group = group;\n        this.multiply = multiply;\n        this.chosenImages = [];\n        $('#' + this.dom_id + ' [name=\"' + this.inputName + '\"]').each(function (i, obj) {\n            if (obj.dataset.filler) {\n                return;\n            }\n            _this.choseImage(parseInt($(obj).val()));\n        });\n        $('#' + this.dom_id).on('click', '.thumbnail.zoomable', function (evt) {\n            _this.zoom(parseInt($(evt.target).parents('.imagewidget-input-image').attr('data-id')));\n        });\n        $('#' + this.dom_id + ' input[type=file]').bootstrapFileInput();\n        $('#' + this.dom_id + ' .file-input-wrapper').removeClass('btn-default').addClass('btn-primary');\n        $('#' + this.dom_id + ' .imagewidget-add-image').on('click', function () {\n            _this.openLibrary();\n        });\n        $('#' + this.dom_id + ' .imagewidget-ok-btn').on('click', function () {\n            _this.closePopups();\n        });\n        $('#' + this.dom_id + ' input[type=file]').on('change', function (evt) {\n            evt.stopPropagation();\n            evt.preventDefault();\n            var files = evt.target.files;\n            $.each(files, function (key, value) {\n                var unique = Math.round(Math.random() * 1000);\n                var data = new FormData();\n                data.append(key, value);\n                data.append('group', _this.group);\n                var reader = new FileReader();\n                var image = $.Deferred();\n                reader.onload = function (e) {\n                    var skeleton = '<div class=\"loading col col-xs-6 col-sm-4 col-md-3 col-lg-2 imagewidget-input-image\" data-unique=\"' + unique + '\">' +\n                        '<div class=\"thumbnail\">' +\n                        '<img src=\"' + e.target.result + '\">' +\n                        '</div>' +\n                        '</div>';\n                    $('#' + _this.dom_id + ' .imagewidget-input .imagewidget-add-image').before(skeleton);\n                    image.resolve($('[data-unique=' + unique + ']'));\n                };\n                reader.readAsDataURL(value);\n                var ajaxOpts = {\n                    url: '/image/upload',\n                    type: 'POST',\n                    data: data,\n                    cache: false,\n                    dataType: 'json',\n                    processData: false,\n                    contentType: false,\n                    success: function (data, textStatus, jqXHR) {\n                        image.done(function (img) {\n                            img.removeClass('loading').removeClass('error').attr('data-id', data.id);\n                            _this.addImage(data);\n                            img.find('button').remove();\n                            img.find('.thumbnail').before('<button type=\"button\" class=\"btn btn-danger remove\">' +\n                                '<span class=\"glyphicon glyphicon-remove\"></span>' +\n                                '</button>').addClass('zoomable');\n                            img.find('button').on('click', function () {\n                                _this.unchoseImage(data.id);\n                            });\n                            $('#' + _this.dom_id).append('<input type=\"hidden\" name=\"' + _this.inputName + '\" value=\"' + data.id + '\"/>');\n                            _this.chosenImages.push(data.id);\n                        });\n                    },\n                    error: function (err) {\n                        image.done(function (img) {\n                            if (!img.data('tried')) {\n                                img.data('tried', true);\n                                img.find('.thumbnail').before('<button type=\"button\" class=\"btn btn-success retry\">' +\n                                    '<span class=\"glyphicon glyphicon-refresh\"></span>' +\n                                    '</button>' +\n                                    '<button type=\"button\" class=\"btn btn-danger remove\">' +\n                                    '<span class=\"glyphicon glyphicon-remove\"></span>' +\n                                    '</button>');\n                                img.addClass('error').find('button.retry').on('click', function () { $.ajax(ajaxOpts); });\n                                img.find('button.remove').on('click', function () {\n                                    img.remove();\n                                });\n                            }\n                        });\n                    }\n                };\n                $.ajax(ajaxOpts);\n            });\n            _this.closePopups();\n        });\n        $('#' + this.dom_id + ' .imagewidget-zoom > .img-port').on('click', function () { _this.closePopups(); });\n        var $inp = $('input[data-imagewidget]');\n        $inp.data('value', JSON.stringify($inp.val()));\n    }\n    ImageWidget.prototype.zoom = function (id) {\n        $('body').css('overflow', 'hidden');\n        var $backlight = $('#' + this.dom_id + ' .imagewidget-backlight'), $zoom = $backlight.find('.imagewidget-zoom');\n        $backlight.removeClass('closed');\n        $zoom.removeClass('closed').find('img').attr('src', '' + this.images[id].thumb);\n        $zoom.find('.img-port').css('background-image', \"url('\" + this.images[id].thumb + \"')\");\n    };\n    ImageWidget.prototype.choseImage = function (id) {\n        var _this = this;\n        if (this.chosenImages.indexOf(id) !== -1) {\n            return;\n        }\n        this.chosenImages.push(id);\n        if ($('#' + this.dom_id + ' input[value=\"' + id + '\"]').length == 0) {\n            $('#' + this.dom_id).append('<input type=\"hidden\" name=\"' + this.inputName + '\" value=\"' + id + '\"/>');\n        }\n        $('#' + this.dom_id + ' .imagewidget-library-image[data-id=' + id + ']').addClass('chosen');\n        $('#' + this.dom_id + ' .imagewidget-input .imagewidget-add-image').before('<div class=\"col col-xs-6 col-sm-4 col-md-3 col-lg-2 imagewidget-input-image\" data-id=\"' + id + '\">' +\n            '<button type=\"button\" class=\"btn btn-danger remove\">' +\n            '<span class=\"glyphicon glyphicon-remove\"></span>' +\n            '</button>' +\n            '<div class=\"thumbnail zoomable\">' +\n            '<img src=\"' + this.images[id].thumb + '\">' +\n            '</div>' +\n            '</div>');\n        $('#' + this.dom_id + ' .imagewidget-input-image[data-id=' + id + '] button.remove').on('click', function (evt) {\n            _this.unchoseImage(parseInt($(evt.currentTarget.parentElement).data('id')));\n        });\n        if (!this.multiply) {\n            $('#' + this.dom_id + ' .imagewidget-input .imagewidget-add-image').hide();\n        }\n    };\n    ImageWidget.prototype.unchoseImage = function (id) {\n        $('#' + this.dom_id + ' .imagewidget-library-image.chosen[data-id=' + id + ']').removeClass('chosen');\n        $('#' + this.dom_id + ' .imagewidget-input-image[data-id=' + id + ']').remove();\n        $('#' + this.dom_id + ' [name=\"' + this.inputName + '\"][value=' + id + ']').remove();\n        this.chosenImages.splice(this.chosenImages.indexOf(id), 1);\n        if (!this.multiply) {\n            $('#' + this.dom_id + ' .imagewidget-input .imagewidget-add-image').show();\n        }\n    };\n    ImageWidget.prototype.unchoseImages = function () {\n        var _this = this;\n        var currentImages = [];\n        $('#' + this.dom_id + ' [name=\"' + this.inputName + '\"]').each(function () {\n            currentImages.push(parseInt($(_this).val()));\n        });\n        for (var i = 0; i < currentImages.length; i++) {\n            this.unchoseImage(currentImages[i]);\n        }\n    };\n    ImageWidget.prototype.renderLibrary = function (pagination) {\n        var _this = this;\n        if (pagination === void 0) { pagination = 0; }\n        console.log(this.images);\n        var images = this.images, $library = $('#' + this.dom_id + ' .imagewidget-popup'), $images_container = $library.find('.imagewidget-popup-content').empty(), $pagination = $library.find('.pagination').empty(), imagesCount = 0;\n        if ($images_container.width() === 0) {\n            return;\n        }\n        for (var i in images) {\n            if (images.hasOwnProperty(i)) {\n                imagesCount++;\n            }\n        }\n        var imagesPerPage = Math.floor($images_container.width() / 240), maxPagination = Math.ceil(imagesCount / imagesPerPage);\n        for (var i = 0; i < maxPagination; i++) {\n            $pagination.append('<li data-pagination-num=\"' + i + '\" class=\"' + (pagination == i ? 'active' : '') + '\"><a>' + (i + 1) + '</a></li>');\n            $pagination.find('li[data-pagination-num=\"' + i + '\"]').on('click', function (evt) {\n                var newPagination = parseInt($((evt).target.parentElement).data('pagination-num'));\n                _this.renderLibrary(newPagination);\n            });\n        }\n        var index = imagesPerPage * pagination, counter = 0;\n        for (var img_id in images) {\n            if (images.hasOwnProperty(img_id)) {\n                var image = images[img_id];\n                if (counter >= index && counter < (index + imagesPerPage)) {\n                    $images_container.append('<div class=\"col thumbnail imagewidget-library-image ' +\n                        (this.chosenImages.indexOf(image.id) !== -1 ? 'chosen' : '') + '\" data-id=\"' + img_id + '\">' +\n                        '<img src=\"' + image['thumb'] + '\" />' +\n                        '</div>');\n                }\n                counter++;\n            }\n        }\n        if ($images_container.data('evt_handler') !== true) {\n            $images_container.data('evt_handler', true);\n            $images_container.on('click', '.thumbnail', function (evt) {\n                var target = evt.currentTarget;\n                if ($(target).hasClass('chosen')) {\n                    _this.unchoseImage(parseInt($(target).data('id')));\n                }\n                else {\n                    _this.choseImage(parseInt($(target).data('id')));\n                }\n            });\n        }\n    };\n    ImageWidget.prototype.addImage = function (data) {\n        this.images[data.id] = data;\n    };\n    ImageWidget.prototype.closePopups = function () {\n        $('body').css('overflow', 'initial');\n        $('#' + this.dom_id + ' .imagewidget-backlight').addClass('closed').children().addClass('closed');\n    };\n    ImageWidget.prototype.openLibrary = function () {\n        $('body').css('overflow', 'hidden');\n        $('#' + this.dom_id + ' .imagewidget-backlight').removeClass('closed').find('.imagewidget-popup').removeClass('closed');\n        this.renderLibrary();\n    };\n    return ImageWidget;\n}());\nexports.ImageWidget = ImageWidget;\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90cy9JbWFnZVdpZGdldC50cz9iZjhlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvR0FBb0csa0JBQWtCLEVBQUU7QUFDeEg7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1QseUZBQXlGLHFCQUFxQixFQUFFO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGdCQUFnQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEIiwiZmlsZSI6IjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgSW1hZ2VXaWRnZXQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEltYWdlV2lkZ2V0KGRvbV9pZCwgaW5wdXROYW1lLCBpbWFnZXMsIGdyb3VwLCBtdWx0aXBseSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbV9pZCA9IGRvbV9pZDtcbiAgICAgICAgdGhpcy5pbnB1dE5hbWUgPSBpbnB1dE5hbWU7XG4gICAgICAgIHRoaXMuaW1hZ2VzID0gaW1hZ2VzO1xuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XG4gICAgICAgIHRoaXMubXVsdGlwbHkgPSBtdWx0aXBseTtcbiAgICAgICAgdGhpcy5jaG9zZW5JbWFnZXMgPSBbXTtcbiAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgW25hbWU9XCInICsgdGhpcy5pbnB1dE5hbWUgKyAnXCJdJykuZWFjaChmdW5jdGlvbiAoaSwgb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmRhdGFzZXQuZmlsbGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuY2hvc2VJbWFnZShwYXJzZUludCgkKG9iaikudmFsKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQpLm9uKCdjbGljaycsICcudGh1bWJuYWlsLnpvb21hYmxlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgX3RoaXMuem9vbShwYXJzZUludCgkKGV2dC50YXJnZXQpLnBhcmVudHMoJy5pbWFnZXdpZGdldC1pbnB1dC1pbWFnZScpLmF0dHIoJ2RhdGEtaWQnKSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgaW5wdXRbdHlwZT1maWxlXScpLmJvb3RzdHJhcEZpbGVJbnB1dCgpO1xuICAgICAgICAkKCcjJyArIHRoaXMuZG9tX2lkICsgJyAuZmlsZS1pbnB1dC13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2J0bi1kZWZhdWx0JykuYWRkQ2xhc3MoJ2J0bi1wcmltYXJ5Jyk7XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1hZGQtaW1hZ2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5vcGVuTGlicmFyeSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgLmltYWdld2lkZ2V0LW9rLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmNsb3NlUG9wdXBzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcjJyArIHRoaXMuZG9tX2lkICsgJyBpbnB1dFt0eXBlPWZpbGVdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZXZ0LnRhcmdldC5maWxlcztcbiAgICAgICAgICAgICQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdW5pcXVlID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMCk7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnZ3JvdXAnLCBfdGhpcy5ncm91cCk7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2tlbGV0b24gPSAnPGRpdiBjbGFzcz1cImxvYWRpbmcgY29sIGNvbC14cy02IGNvbC1zbS00IGNvbC1tZC0zIGNvbC1sZy0yIGltYWdld2lkZ2V0LWlucHV0LWltYWdlXCIgZGF0YS11bmlxdWU9XCInICsgdW5pcXVlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ0aHVtYm5haWxcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW1nIHNyYz1cIicgKyBlLnRhcmdldC5yZXN1bHQgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBfdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1pbnB1dCAuaW1hZ2V3aWRnZXQtYWRkLWltYWdlJykuYmVmb3JlKHNrZWxldG9uKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2UucmVzb2x2ZSgkKCdbZGF0YS11bmlxdWU9JyArIHVuaXF1ZSArICddJykpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwodmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBhamF4T3B0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2ltYWdlL3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5kb25lKGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5hdHRyKCdkYXRhLWlkJywgZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWRkSW1hZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nLmZpbmQoJ2J1dHRvbicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZy5maW5kKCcudGh1bWJuYWlsJykuYmVmb3JlKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIHJlbW92ZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPicpLmFkZENsYXNzKCd6b29tYWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZy5maW5kKCdidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnVuY2hvc2VJbWFnZShkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjJyArIF90aGlzLmRvbV9pZCkuYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInICsgX3RoaXMuaW5wdXROYW1lICsgJ1wiIHZhbHVlPVwiJyArIGRhdGEuaWQgKyAnXCIvPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNob3NlbkltYWdlcy5wdXNoKGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5kb25lKGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWltZy5kYXRhKCd0cmllZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZy5kYXRhKCd0cmllZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcuZmluZCgnLnRodW1ibmFpbCcpLmJlZm9yZSgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MgcmV0cnlcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVmcmVzaFwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIHJlbW92ZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZy5hZGRDbGFzcygnZXJyb3InKS5maW5kKCdidXR0b24ucmV0cnknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7ICQuYWpheChhamF4T3B0cyk7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcuZmluZCgnYnV0dG9uLnJlbW92ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICQuYWpheChhamF4T3B0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF90aGlzLmNsb3NlUG9wdXBzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcjJyArIHRoaXMuZG9tX2lkICsgJyAuaW1hZ2V3aWRnZXQtem9vbSA+IC5pbWctcG9ydCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgX3RoaXMuY2xvc2VQb3B1cHMoKTsgfSk7XG4gICAgICAgIHZhciAkaW5wID0gJCgnaW5wdXRbZGF0YS1pbWFnZXdpZGdldF0nKTtcbiAgICAgICAgJGlucC5kYXRhKCd2YWx1ZScsIEpTT04uc3RyaW5naWZ5KCRpbnAudmFsKCkpKTtcbiAgICB9XG4gICAgSW1hZ2VXaWRnZXQucHJvdG90eXBlLnpvb20gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgJCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgICAgIHZhciAkYmFja2xpZ2h0ID0gJCgnIycgKyB0aGlzLmRvbV9pZCArICcgLmltYWdld2lkZ2V0LWJhY2tsaWdodCcpLCAkem9vbSA9ICRiYWNrbGlnaHQuZmluZCgnLmltYWdld2lkZ2V0LXpvb20nKTtcbiAgICAgICAgJGJhY2tsaWdodC5yZW1vdmVDbGFzcygnY2xvc2VkJyk7XG4gICAgICAgICR6b29tLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5maW5kKCdpbWcnKS5hdHRyKCdzcmMnLCAnJyArIHRoaXMuaW1hZ2VzW2lkXS50aHVtYik7XG4gICAgICAgICR6b29tLmZpbmQoJy5pbWctcG9ydCcpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsIFwidXJsKCdcIiArIHRoaXMuaW1hZ2VzW2lkXS50aHVtYiArIFwiJylcIik7XG4gICAgfTtcbiAgICBJbWFnZVdpZGdldC5wcm90b3R5cGUuY2hvc2VJbWFnZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5jaG9zZW5JbWFnZXMuaW5kZXhPZihpZCkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaG9zZW5JbWFnZXMucHVzaChpZCk7XG4gICAgICAgIGlmICgkKCcjJyArIHRoaXMuZG9tX2lkICsgJyBpbnB1dFt2YWx1ZT1cIicgKyBpZCArICdcIl0nKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCkuYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInICsgdGhpcy5pbnB1dE5hbWUgKyAnXCIgdmFsdWU9XCInICsgaWQgKyAnXCIvPicpO1xuICAgICAgICB9XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1saWJyYXJ5LWltYWdlW2RhdGEtaWQ9JyArIGlkICsgJ10nKS5hZGRDbGFzcygnY2hvc2VuJyk7XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1pbnB1dCAuaW1hZ2V3aWRnZXQtYWRkLWltYWdlJykuYmVmb3JlKCc8ZGl2IGNsYXNzPVwiY29sIGNvbC14cy02IGNvbC1zbS00IGNvbC1tZC0zIGNvbC1sZy0yIGltYWdld2lkZ2V0LWlucHV0LWltYWdlXCIgZGF0YS1pZD1cIicgKyBpZCArICdcIj4nICtcbiAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIHJlbW92ZVwiPicgK1xuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInRodW1ibmFpbCB6b29tYWJsZVwiPicgK1xuICAgICAgICAgICAgJzxpbWcgc3JjPVwiJyArIHRoaXMuaW1hZ2VzW2lkXS50aHVtYiArICdcIj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgLmltYWdld2lkZ2V0LWlucHV0LWltYWdlW2RhdGEtaWQ9JyArIGlkICsgJ10gYnV0dG9uLnJlbW92ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIF90aGlzLnVuY2hvc2VJbWFnZShwYXJzZUludCgkKGV2dC5jdXJyZW50VGFyZ2V0LnBhcmVudEVsZW1lbnQpLmRhdGEoJ2lkJykpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBseSkge1xuICAgICAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgLmltYWdld2lkZ2V0LWlucHV0IC5pbWFnZXdpZGdldC1hZGQtaW1hZ2UnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEltYWdlV2lkZ2V0LnByb3RvdHlwZS51bmNob3NlSW1hZ2UgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgLmltYWdld2lkZ2V0LWxpYnJhcnktaW1hZ2UuY2hvc2VuW2RhdGEtaWQ9JyArIGlkICsgJ10nKS5yZW1vdmVDbGFzcygnY2hvc2VuJyk7XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1pbnB1dC1pbWFnZVtkYXRhLWlkPScgKyBpZCArICddJykucmVtb3ZlKCk7XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIFtuYW1lPVwiJyArIHRoaXMuaW5wdXROYW1lICsgJ1wiXVt2YWx1ZT0nICsgaWQgKyAnXScpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmNob3NlbkltYWdlcy5zcGxpY2UodGhpcy5jaG9zZW5JbWFnZXMuaW5kZXhPZihpZCksIDEpO1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbHkpIHtcbiAgICAgICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1pbnB1dCAuaW1hZ2V3aWRnZXQtYWRkLWltYWdlJykuc2hvdygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBJbWFnZVdpZGdldC5wcm90b3R5cGUudW5jaG9zZUltYWdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGN1cnJlbnRJbWFnZXMgPSBbXTtcbiAgICAgICAgJCgnIycgKyB0aGlzLmRvbV9pZCArICcgW25hbWU9XCInICsgdGhpcy5pbnB1dE5hbWUgKyAnXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjdXJyZW50SW1hZ2VzLnB1c2gocGFyc2VJbnQoJChfdGhpcykudmFsKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudEltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy51bmNob3NlSW1hZ2UoY3VycmVudEltYWdlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEltYWdlV2lkZ2V0LnByb3RvdHlwZS5yZW5kZXJMaWJyYXJ5ID0gZnVuY3Rpb24gKHBhZ2luYXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHBhZ2luYXRpb24gPT09IHZvaWQgMCkgeyBwYWdpbmF0aW9uID0gMDsgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmltYWdlcyk7XG4gICAgICAgIHZhciBpbWFnZXMgPSB0aGlzLmltYWdlcywgJGxpYnJhcnkgPSAkKCcjJyArIHRoaXMuZG9tX2lkICsgJyAuaW1hZ2V3aWRnZXQtcG9wdXAnKSwgJGltYWdlc19jb250YWluZXIgPSAkbGlicmFyeS5maW5kKCcuaW1hZ2V3aWRnZXQtcG9wdXAtY29udGVudCcpLmVtcHR5KCksICRwYWdpbmF0aW9uID0gJGxpYnJhcnkuZmluZCgnLnBhZ2luYXRpb24nKS5lbXB0eSgpLCBpbWFnZXNDb3VudCA9IDA7XG4gICAgICAgIGlmICgkaW1hZ2VzX2NvbnRhaW5lci53aWR0aCgpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIGlmIChpbWFnZXMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBpbWFnZXNDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBpbWFnZXNQZXJQYWdlID0gTWF0aC5mbG9vcigkaW1hZ2VzX2NvbnRhaW5lci53aWR0aCgpIC8gMjQwKSwgbWF4UGFnaW5hdGlvbiA9IE1hdGguY2VpbChpbWFnZXNDb3VudCAvIGltYWdlc1BlclBhZ2UpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFBhZ2luYXRpb247IGkrKykge1xuICAgICAgICAgICAgJHBhZ2luYXRpb24uYXBwZW5kKCc8bGkgZGF0YS1wYWdpbmF0aW9uLW51bT1cIicgKyBpICsgJ1wiIGNsYXNzPVwiJyArIChwYWdpbmF0aW9uID09IGkgPyAnYWN0aXZlJyA6ICcnKSArICdcIj48YT4nICsgKGkgKyAxKSArICc8L2E+PC9saT4nKTtcbiAgICAgICAgICAgICRwYWdpbmF0aW9uLmZpbmQoJ2xpW2RhdGEtcGFnaW5hdGlvbi1udW09XCInICsgaSArICdcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1BhZ2luYXRpb24gPSBwYXJzZUludCgkKChldnQpLnRhcmdldC5wYXJlbnRFbGVtZW50KS5kYXRhKCdwYWdpbmF0aW9uLW51bScpKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJMaWJyYXJ5KG5ld1BhZ2luYXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluZGV4ID0gaW1hZ2VzUGVyUGFnZSAqIHBhZ2luYXRpb24sIGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpbWdfaWQgaW4gaW1hZ2VzKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2VzLmhhc093blByb3BlcnR5KGltZ19pZCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBpbWFnZXNbaW1nX2lkXTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRlciA+PSBpbmRleCAmJiBjb3VudGVyIDwgKGluZGV4ICsgaW1hZ2VzUGVyUGFnZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGltYWdlc19jb250YWluZXIuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiY29sIHRodW1ibmFpbCBpbWFnZXdpZGdldC1saWJyYXJ5LWltYWdlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2hvc2VuSW1hZ2VzLmluZGV4T2YoaW1hZ2UuaWQpICE9PSAtMSA/ICdjaG9zZW4nIDogJycpICsgJ1wiIGRhdGEtaWQ9XCInICsgaW1nX2lkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiJyArIGltYWdlWyd0aHVtYiddICsgJ1wiIC8+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoJGltYWdlc19jb250YWluZXIuZGF0YSgnZXZ0X2hhbmRsZXInKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgJGltYWdlc19jb250YWluZXIuZGF0YSgnZXZ0X2hhbmRsZXInLCB0cnVlKTtcbiAgICAgICAgICAgICRpbWFnZXNfY29udGFpbmVyLm9uKCdjbGljaycsICcudGh1bWJuYWlsJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBldnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgICAgICBpZiAoJCh0YXJnZXQpLmhhc0NsYXNzKCdjaG9zZW4nKSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51bmNob3NlSW1hZ2UocGFyc2VJbnQoJCh0YXJnZXQpLmRhdGEoJ2lkJykpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNob3NlSW1hZ2UocGFyc2VJbnQoJCh0YXJnZXQpLmRhdGEoJ2lkJykpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSW1hZ2VXaWRnZXQucHJvdG90eXBlLmFkZEltYWdlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pbWFnZXNbZGF0YS5pZF0gPSBkYXRhO1xuICAgIH07XG4gICAgSW1hZ2VXaWRnZXQucHJvdG90eXBlLmNsb3NlUG9wdXBzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsICdpbml0aWFsJyk7XG4gICAgICAgICQoJyMnICsgdGhpcy5kb21faWQgKyAnIC5pbWFnZXdpZGdldC1iYWNrbGlnaHQnKS5hZGRDbGFzcygnY2xvc2VkJykuY2hpbGRyZW4oKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgfTtcbiAgICBJbWFnZVdpZGdldC5wcm90b3R5cGUub3BlbkxpYnJhcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ2JvZHknKS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgICAgICAkKCcjJyArIHRoaXMuZG9tX2lkICsgJyAuaW1hZ2V3aWRnZXQtYmFja2xpZ2h0JykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmZpbmQoJy5pbWFnZXdpZGdldC1wb3B1cCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJMaWJyYXJ5KCk7XG4gICAgfTtcbiAgICByZXR1cm4gSW1hZ2VXaWRnZXQ7XG59KCkpO1xuZXhwb3J0cy5JbWFnZVdpZGdldCA9IEltYWdlV2lkZ2V0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9JbWFnZVdpZGdldC50c1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9")},function(module,exports,__webpack_require__){"use strict";eval("\nexports.__esModule = true;\n__webpack_require__(0);\nvar ImageWidget_1 = __webpack_require__(1);\nwindow.ImageWidget = ImageWidget_1.ImageWidget;\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90cy9hcHAudHM/YmRkZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5yZXF1aXJlKFwiLi4vc3R5bC9tYWluLnN0eWxcIik7XG52YXIgSW1hZ2VXaWRnZXRfMSA9IHJlcXVpcmUoXCIuL0ltYWdlV2lkZ2V0XCIpO1xud2luZG93LkltYWdlV2lkZ2V0ID0gSW1hZ2VXaWRnZXRfMS5JbWFnZVdpZGdldDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvYXBwLnRzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=")}]);