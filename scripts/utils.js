$(document).ready(function () {
    const API_URL = 'http://localhost:3000/users'
    const API_SESSION = 'http://localhost:3000/session'

    //FUNCOES DE VERIFICACAO
    function mensagem(msg, isError = false) {
        $('#mensagem').text(msg).toggleClass('error', isError);
        setTimeout(() => $('#mensagem').text(''), 3000);
    };


    function verificarLogin(email, password) {
        if (email && password) {
            $.ajax({
                url: API_URL,
                dataType: "json",
                method: 'GET',
                success: function (dado) {
                    const userValido = dado.find(element => element.email === email && element.password === password);
                    if (userValido) {
                        const session = { id: `${userValido.id}`, email: userValido.email, nome: userValido.nome, cargo: userValido.cargo };
                        $.ajax({
                            url: API_SESSION,
                            contentType: "application/json",
                            method: "POST",
                            data: JSON.stringify(session),
                            success: function () {
                               $(location).attr('href', '/pages/home.html');
                            }
                        });
                    } else {
                        alert("Usuário não cadastrado");
                        mensagem("Usuário não encontrado no banco de dados!", true);
                    }
                }
            });
        }
    }

    function emailExistente(email, callback) {
        $.ajax({
            url: API_URL,
            dataType: "json",
            method: 'GET',
            success: function (dadoEmail) {
                let emailValido = dadoEmail.some(element => element.email === email);
                if (emailValido) {
                    alert("Email já existente!");
                } else {
                    callback(emailValido)
                }
            },
        });
    }

    function realizarRegistro(email, nome, password, confirmPassword) {
        const idData = Date.now();
        const id = idData.toString();
        const cargo = 'ESPECIALISTA'
        const dadosUser = { id, email, nome, password, cargo }
        emailExistente(email, function (emailValido) {
            if (!emailValido) {
                if (password === confirmPassword) {
                    $.ajax({
                        url: API_URL,
                        contentType: "application/json",
                        method: "POST",
                        data: JSON.stringify(dadosUser),
                        success: function (dado) {
                            $(location).attr('href', '../index.html');
                        }
                    });
                } else {
                    alert("Senhas divergentes!");
                }
            } else {
                alert("Email invalido, ultilize outro email!");
            }
        })
    }

    //EVENTOS HTML
    $('.sign').bind("click", function (e) {
        e.preventDefault();
        const emailInput = $("#email").val();
        const passwordInput = $("#password").val();
        verificarLogin(emailInput, passwordInput);
    });

    $('.register').bind("click", function (e) {
        e.preventDefault();
        const emailInput = $("#email").val();
        const passwordInput = $("#password").val();
        const nameInput = $("#username").val();
        const confirmPasswordInput = $("#confirmPassword").val();
        realizarRegistro(emailInput, nameInput, passwordInput, confirmPasswordInput);
    });


});
