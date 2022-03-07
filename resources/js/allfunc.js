$(document).ready(function () {
    var username = '';

    //без этого токена ларавель не пропустит запрос (для безопастности защита от подделки запроса).
    let _token   = $('meta[name="csrf-token"]').attr('content');



    //Ловим когда какая либа кнопка была отпущена
    $('#username_new').keyup(function () {

        var value = $(this).val(); //Получаем данные из переменной.

        //синтаксим аякс
        $.ajax({
            url: 'getuserbyname',
            type: "POST",
            data: {
                _token: _token,
                username:value,
            },
            //Ответ если удалось отправить и получить
            success: function(msg) {
                console.log(msg);

                if(msg == 'valid') {
                    $('#message').html('<font color="green">This username is free.</font>');
                    username = value;
                } else {
                    $('#message').html('<font color="red">This username is busy.</font>');
                    username = '';
                }
            }
        });
    });

    //Добавление пользователя (ajax с выводом результата добавленного в конец списка без обновления страницы).
    $('#addUser').click(function () {
        if(username === '') {
            $('#message').html('<font color="red">Username is empty. Input username.</font>');
        } else {
            var password = $('password_new').val(); //Получаем данные из переменной.

            $.ajax({
                type: 'POST',
                url:'adduser',
                data:{
                    _token: _token,
                    username: username,
                    password: password
                },
                success:function(msg){
                    console.log(msg);

                    if(msg['msg'] === 'ok') {
                        $('#message').html('<font color="green">New user added to base.</font>');

                        $('.tbody').append(
                            '<tr id="'+msg['id'] +'">'+
                            '<td>'+msg['id'] +'</td>'+
                            '<td><input type="text" id="username-'+msg['id']+'" name="username" placeholder="'+msg['username']+'"></td>'+
                            '<td>'+msg['created_at']+'</td>'+
                            '<td>'+msg['updated_at']+'</td>'+
                            '<td><input type="password" id="password-'+msg['id']+'" name="new_password" placeholder="Enter new password"></td>'+
                            '<td><button type="button" class="btn btn-info updateUser" id="updateUser-'+msg['id']+'">Изменить</button></td>'+
                            '<td><button type="button" class="btn btn-info deleteUser" id="deleteUser-'+msg['id']+'">Удалить</button></td>'+
                            '</tr>'
                        );
                    } else {
                        $('#message').html('<font color="red"><b>User not added to base.</b></font>');
                    }
                }
            });
        }
    });

    //Удаление пользователя
    $(document).on('click','.deleteUser',function (e) {
        //Получаем идентификатор в бд из идентификатора кнопки.
        var strId = $(this).prop('id');
        id = strId.split('-',2);

        $.ajax({
            type: 'POST',
            url:'deleteuser',
            data:{
                _token: _token,
                id: id[1]
            },
            success:function(msg) {
                if (msg['msg'] == 'true') {
                    $('#message').html('<font color="green"><b>User success delete from database.</b></font>');

                    //Идентификатор елемента для удаления.
                    var str = "#"+id[1];
                    $(str).remove();

                } else {
                    $('#message').html('<font color="red"><b>User not delete from database.</b></font>');
                }
            }
        });
    });


    //Удаление пользователя
    $(document).on('click','.updateUser',function (e) {
        //Получаем идентификатор в бд из идентификатора кнопки.
        var strId = $(this).prop('id');
        id = strId.split('-',2);

        var StrIds = '#password-'+id[1];
        var password = $('#password-'+id[1]).val();
        var username = $('#username-'+id[1]).val();

        $.ajax({
            type: 'POST',
            url:'updateuser',
            data:{
                _token: _token,
                id: id[1],
                username: username,
                password: password,
                id: id[1]
            },
            success:function(msg) {

                if (msg['msg'] == 'true') {

                    //Идентификатор елемента для удаления.
                    var str = "#"+id[1];
                    $(str).replaceWith(
                        '<tr id="'+msg['id'] +'">'+
                        '<td>'+msg['id'] +'</td>'+
                        '<td><input type="text" id="username-'+msg['id']+'" name="username" placeholder="'+msg['username']+'"></td>'+
                        '<td>'+msg['created_at']+'</td>'+
                        '<td>'+msg['updated_at']+'</td>'+
                        '<td><input type="password" id="password-'+msg['id']+'" name="new_password" placeholder="Enter new password"></td>'+
                        '<td><button type="button" class="btn btn-info updateUser" id="updateUser-'+msg['id']+'">Изменить</button></td>'+
                        '<td><button type="button" class="btn btn-info deleteUser" id="deleteUser-'+msg['id']+'">Удалить</button></td>'+
                        '</tr>'
                    );

                    $('#message').html('<font color="green"><b>User success update from database.</b></font>');

                } else {
                    $('#message').html('<font color="red"><b>User not update from database.</b></font>');
                }
            }
        });
    });


});
