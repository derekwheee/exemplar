/* globals Isotope */

function filter(nORs) {
    $('.listings').isotope({
        layoutMode: 'none',
        filter: function () {
            for (var x = 0; x < nORs.length; x++) {

                var returnInner = false;
                for (var y = 0; y < nORs[x].length; y++) {
                    var cssClass = nORs[x][y].replace('.', '');

                    if ($(this).hasClass(cssClass)) {
                        returnInner = true;
                    }
                }

                if (returnInner === false) {
                    return false;
                }
            }

            return true;
        }
    });
}

function getFilters($this) {
    // Build required data list        
    var nORs = [];
    $this.closest('.filters').find('input[type=checkbox]:checked, select').each(function () {

        // Build out the "OR"'s
        $('.filters .filter-group').each(function () {
            var nVals = [];
            $(this).find('input[type=checkbox]:checked, select option:selected').each(function () {
                var filter = $(this).attr('data-filter');
                if (filter !== undefined) {
                    nVals.push(filter);
                }
            });

            if (nVals !== null && nVals.length > 0) {
                nORs.push(nVals);
            }
        });
    });

    // date range
    var start = $('.filters .filter-group .start-date').datepicker('getDate');
    var end = $('.filters .filter-group .end-date').datepicker('getDate');

    if (start !== null && start.length === undefined && end !== null && end.length === undefined) {
        var currentDate = start;
        var nVals = [];

        /*
            This is something that needs to be changed on every project.
            Could be a setting that puts a data-timezone-offset attr on the body.
            var timezoneOffset = $('body').attr('data-timezone-offset');
        */
        var timezoneOffset = 300;

        while (currentDate <= end) {
            // http://momentjs.com/docs/#/get-set/
            currentDate = moment.utc(new Date(currentDate));
            currentDate.utcOffset(timezoneOffset);
            var theDateString = '.date-' + currentDate.year() + '-' + (currentDate.month() + 1) + '-' + currentDate.date();
            nVals.push(theDateString);
            currentDate.add(1, 'day');
        }
        if (nVals !== null && nVals.length > 0) {
            nORs.push(nVals);
        }
    }
    filter(nORs);
}

$(function () {

    if ($('.filters').length) {
        Isotope.Item.prototype._create = function () {
            // assign id, used for original-order sorting
            this.id = this.layout.itemGUID++;
            // transition objects
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            };
            this.sortData = {};
        };

        Isotope.prototype.arrange = function (opts) {
            // set any options pass
            this.option(opts);
            this._getIsInstant();
            // just filter
            this.filteredItems = this._filter(this.items);
            // flag for initalized
            this._isLayoutInited = true;
        };

        // layout mode that does not position items
        Isotope.LayoutMode.create('none'); 

        $('.filters input[type=checkbox], .filters select').change(function () {
            getFilters($(this));
        });

        $('.filter-group .start-date').datepicker({
            minDate: 0,
            numberOfMonths: 2,
            onClose: function (selectedDate) {
                $('.filter-group .end-date').datepicker('option', 'minDate', selectedDate);
            }
        });
        $('.filter-group .end-date').datepicker({
            minDate: 0,
            numberOfMonths: 2,
            onClose: function (selectedDate) {
                $('.filter-group .start-date').datepicker('option', 'maxDate', selectedDate);
            }
        });
        $('.filter-group .apply-date-range').click(function () {
            getFilters($(this));
        });
    }
});