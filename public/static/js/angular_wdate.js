app.directive('wdatePickerStime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.stime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.stime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEtime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.etime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.etime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEndstime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.endstime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.endstime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEndetime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.endetime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.endetime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEndstime1', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    minDate: new Date(),
                    onpicked: function () {
                        scope.$apply(scope.endstime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.endstime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEndetime1', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    minDate: new Date(),
                    onpicked: function () {
                        scope.$apply(scope.endetime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.endetime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerAddtime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.addtime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.addtime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEdittime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.edittime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.edittime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerDeltime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.deltime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.deltime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerChStime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    maxDate: new Date(),
                    minDate: new Date(new Date().getTime() - 89 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
                    onpicked: function () {
                        scope.$apply(scope.stime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.stime = '');
                    }

                })
            });
        }
    }
});
app.directive('wdatePickerChEtime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {

            element.bind('click', function () {
                window.WdatePicker({
                    maxDate: new Date(),
                    minDate: new Date(new Date().getTime() - 89 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
                    onpicked: function () {
                        scope.$apply(scope.etime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.etime = '');
                    }
                })
            });
        }
    }
});

app.directive('wdatePickerEndtime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    dateFmt: "yyyy-MM-dd HH-mm-ss",
                    onpicked: function () {
                        scope.$apply(scope.etime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.etime = '');
                    }
                })
            });

        }
    }
});
app.directive('wdatePickerEndoftime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.endoftime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.stime = '');
                    }
                })
            });
        }
    }
});


app.directive('wdatePickerStarttime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.starttime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.starttime = '');
                    }
                })
            });
        }
    }
});

app.directive('wdatePickerOvertime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    onpicked: function () {
                        scope.$apply(scope.overtime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.overtime = '');
                    }
                })
            });
        }
    }
});
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/^0+|[^0-9]+/g, '');              
                // var transformedInput = inputValue.replace( /^\d+(?:\.\d{1,2})?$/, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});
app.directive('integerOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]+/g, '');              
                // var transformedInput = inputValue.replace( /^\d+(?:\.\d{1,2})?$/, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});
app.directive('onlyTwoDecimals', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                // var transformedInput = inputValue.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3') 
                var value = inputValue.replace(/[^\d.]/g, "");
                value = value.replace(/^\./g, "");
                value = value.replace(/\.{2,}/g, ".");
                value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                // var transformedInput = inputValue.replace(/^0+|[^0-9]+/g, '');
                if (value != inputValue) {
                    modelCtrl.$setViewValue(value);
                    modelCtrl.$render();
                }

                return value;
            });
        }
    };
});


app.directive('wdatePickerTrafficStime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                    minDate: new Date(),
                    onpicked: function () {
                        scope.$apply(scope.stime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.stime = '');
                    }

                })
            });
        }
    }
});
app.directive('wdatePickerTrafficEtime', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {

            element.bind('click', function () {
                window.WdatePicker({
                    minDate: new Date(),
                    onpicked: function () {
                        scope.$apply(scope.etime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.etime = '');
                    }
                })
            });
        }
    }
});

app.directive('wdatePickerStime2', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                	minDate: new Date(),
                    onpicked: function () {
                        scope.$apply(scope.stime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.stime = '');
                    }
                })
            });
        }
    }
});
app.directive('wdatePickerEtime2', function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind('click', function () {
                window.WdatePicker({
                	minDate: new Date(),
                    onpicked: function () {
                        scope.$apply(scope.etime = this.value);
                        attr.val = this.value;
                    },
                    oncleared: function () {
                        scope.$apply(scope.etime = '');
                    }
                })
            });
        }
    }
});