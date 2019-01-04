define(['layui', 'text!../../pages/incomeTable.html'], function (layui, incomeTable) {

    var obj = {
        template: incomeTable,
        data: function () {
            return {
            }
        },
        methods: {

        }
    }
    return {
        incomeTable: obj
    }
});