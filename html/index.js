/**
 * join.html
 */

const $joinInputs = $(
    ".inputbox-wrap input[type='text'], input[type='password'], input[type='number']"
);
const $genderInput = $(".checkWrap");
const nameRegex = /^[가-힣|a-z|A-Z|]+$/;
const nicknameRegex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
const specialCharacterRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim;
const birthRegex = /^(19[0-9][0-9]|20\d{2}).?(0[0-9]|1[0-2]).?(0[1-9]|[1-2][0-9]|3[0-1])$/;
const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
const idRegex = /^(?!(?:[0-9]+)$)([a-zA-Z]|[0-9a-zA-Z]){4,}$/;
const passwordNumberRegex = /[0-9]/g;
const passwordEnglishRegex = /[a-z]/gi;
const passwordSpecialCharacterRegex = /[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi;
const emailRegex = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/;
const $checks = $("input[name='memberGender']");
const $genderCheckImg = $('.genderCheckImg');

/* keyup 이벤트용 */
const inputPhone = document.querySelector('.join-phone');
const inputCode = document.querySelector('.join-check');
const phoneButton = document.querySelector('.join-phone-btn');
const codeButton = document.querySelector('.join-check-btn');
/* ============ */

let phoneNumberCheck;
let code;

let joinBlurMessages = [
    '아이디를 입력하세요.',
    '비밀번호를 입력하세요.',
    '비밀번호 확인을 위해 한번 더 입력하세요.',
    '이름을 입력하세요.',
    '휴대폰 번호를 입력하세요.',
    '인증번호를 입력하세요',
    '닉네임을 입력하세요.',
    '이메일을 입력하세요.',
    '생년월일을 입력하세요.',
    '성별을 선택하세요.'
];
let joinRegexMessages = [
    '영문 혹은 영문과 숫자를 조합하여 4자~20자로 입력해주세요.',
    '공백 제외 영어 및 숫자, 특수문자 모두 포함하여 10~20자로 입력해주세요.',
    '위 비밀번호와 일치하지 않습니다. 다시 입력해주세요.',
    '영문 혹은 한글로 2자~20자로 입력해주세요.',
    '휴대폰 번호를 확인하세요.',
    '인증번호를 확인하세요.',
    '닉네임을 확인하세요.',
    '이메일 주소를 확인하세요.',
    '생년월일을 확인하세요.',
];
const $joinHelp = $('p.help');

let joinCheck;
let joinCheckAll = [false, false, false, false, false, false, false, false, false, false];

$('.modal').hide();

$joinInputs.eq(4).on('focus', function () {
    $(this).val($(this).val().replaceAll('-', ''));
});

$joinInputs.eq(8).on('focus', function () {
    $(this).val($(this).val().replaceAll('.', ''));
});

/* 인증번호 입력 버튼 */
$(".join-check-btn").on("click", function(){
    if($(".join-check").val() == code){
        let modalMessage = "인증이 완료되었습니다.";
        showWarnModal(modalMessage);
        console.log(joinCheck);
        joinCheck = true;
        return;
    }
    joinCheck = false;
});

$joinInputs.on('blur', function () {
    let i = $joinInputs.index($(this));
    let value = $(this).val();
    console.log($(this));
    $(this).next().hide();
    $(this).next().fadeIn(500);

    if (!value) {
        if (i == 1) {
            $('.join-password-p').hide();
        }
        $joinHelp.eq(i).text(joinBlurMessages[i]);
        $joinHelp.eq(i).css('color', 'red');
        joinCheck = false;
        $joinInputs.eq(i).css('border', '1px solid rgb(255, 64, 62)');
        joinCheckAll[i] = joinCheck;
        return;
    }

    switch (i) {
        case 0:
            joinCheck =
                value.length > 3 &&
                value.length < 21 &&
                idRegex.test(value) &&
                !specialCharacterRegex.test(value);
            break;
        case 1:
            let numberCheck = value.search(passwordNumberRegex);
            let englishCheck = value.search(passwordEnglishRegex);
            let specialCharacterCheck = value.search(passwordSpecialCharacterRegex);

            var condition1 =
                numberCheck >= 0 &&
                englishCheck >= 0 &&
                englishCheck >= 0 &&
                specialCharacterCheck >= 0 &&
                specialCharacterCheck >= 0 &&
                numberCheck >= 0;
            var condition2 = value.length > 9 && value.length < 21;
            var condition3 = value.search(/\s/) < 0;

            joinCheck = condition1 && condition2 && condition3;
            break;
        case 2:
            joinCheck = $joinInputs.eq(i - 1).val() == value;
            break;
        case 3:
            joinCheck =
                value.length > 1 &&
                value.length < 21 &&
                nameRegex.test(value) &&
                !specialCharacterRegex.test(value);
            break;
        case 4:
            joinCheck = phoneRegex.test(value);
            if (joinCheck) {
                $(this).val(value.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
            }
            break;
        case 5:
            joinCheck = value == code;
            console.log(code);
            break;
        case 6:
            joinCheck =
                value.length > 1 &&
                value.length < 21 &&
                nicknameRegex.test(value) &&
                !specialCharacterRegex.test(value);
            break;
        case 7:
            joinCheck = emailRegex.test(value);
            break;
        case 8:
            joinCheck = birthRegex.test(value);
            if (joinCheck) {
                $(this).val(value.replace(/^(\d{4})(\d{2})(\d{2})$/, `$1.$2.$3`));
            }
            break;
    }

    joinCheckAll[i] = joinCheck;

    if (!joinCheck) {
        if (i == 1) {
            $('.join-password-p').hide();
        }
        $joinHelp.eq(i).text(joinRegexMessages[i]);
        $joinHelp.eq(i).css('color', 'red');
        $joinInputs.eq(i).css('border', '1px solid rgb(255, 64, 62)');
        return;
    }

    if (i == 0) {
        $.ajax({
            type: "POST",
            url: "/member/checkId",
            data: {memberIdentification: value},
            success: function (result) {
                let message;
                if (result != "success") {
                    message = "중복된 아이디입니다.";
                    $joinHelp.eq(i).show();
                    $joinHelp.eq(i).css('color', 'red');
                    $joinInputs.eq(i).css('border', '1px solid rgb(255, 64, 62)');
                    joinCheckAll[i] = false;
                } else {
                    joinCheckAll[i] = true;
                }
                $joinHelp.eq(i).text(message);
            }
        });
    } else if (i == 4) {
        $(".join-phone-btn").click(function () {
            $.ajax({
                type: "POST",
                url: "/member/checkPhone",
                data: {memberPhone: value.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)},
                success: function (result) {
                    let message;
                    if (result != "success") {
                        message = "중복된 휴대폰 번호입니다.";
                        $joinHelp.eq(i).show();
                        $joinHelp.eq(i).css('color', 'red')
                        $joinInputs.eq(i).css('border', '1px solid rgb(255, 64, 62)');
                        phoneNumberCheck = false;
                        joinCheckAll[i] = false;
                    } else {
                        let modalMessage = "인증번호가 전송되었습니다.";
                        showWarnModal(modalMessage);
                        $joinHelp.eq(i).hide();
                        console.log(i);
                        $joinInputs.eq(i).css('border', '1px solid #05AE68');
                        phoneNumberCheck = true;
                        joinCheckAll[i] = true;
                        let phone = $(".join-phone").val().replaceAll("-", "");
                        console.log(phone);
                        $.ajax({
                            type: "POST",
                            url: "/member/checkSms",
                            data: {memberPhone: phone},
                            success: function(data) {
                                console.log(data);
                                code = data;
                            }
                        });
                    }
                    $joinHelp.eq(i).text(message);
                }
            });
        });
    } else if (i == 6) {
        $.ajax({
            type: "POST",
            url: "/member/checkNickname",
            data: {memberNickname: value},
            success: function (result) {
                let message;
                if (result != "success") {
                    message = "중복된 닉네임입니다.";
                    $joinHelp.eq(i).show();
                    $joinHelp.eq(i).css('color', 'red')
                    $joinInputs.eq(i).css('border', '1px solid rgb(255, 64, 62)');
                    joinCheckAll[i] = false;
                } else {
                    joinCheckAll[i] = true;
                }
                $joinHelp.eq(i).text(message);
            }
        });
    }   else if (i == 7) {
        $.ajax({
            type: "POST",
            url: "/member/checkEmail",
            data: {memberEmail: value},
            success: function (result) {
                let message;
                if (result != "success") {
                    message = "중복된 이메일입니다.";
                    $joinHelp.eq(i).show();
                    $joinHelp.eq(i).css('color', 'red')
                    $joinInputs.eq(i).css('border', '1px solid rgb(255, 64, 62)');
                    joinCheckAll[i] = false;
                } else {
                    joinCheckAll[i] = true;
                }
                $joinHelp.eq(i).text(message);
            }
        });
    }

    $joinInputs.eq(i).css('border', '1px solid #05AE68');
    $('.join-password-p').show();
    $joinHelp.hide();


});

inputPhone.addEventListener('keyup', activePhone);

function activePhone() {
    switch (!phoneRegex.test($(inputPhone).val())) {
        case true:
            phoneButton.disabled = true;
            break;
        case false:
            phoneButton.disabled = false;
            break;
    }
}

inputCode.addEventListener('keyup', activeCode);

function activeCode() {
    switch ($(inputCode).val().length == 4) {
        case true:
            codeButton.disabled = false;
            break;
        case false:
            codeButton.disabled = true;
            break;
    }
}

/* 성별 선택 */
$checks.on('change', function () {
    $(".checkWrap").css('border', '1px solid #05AE68');
    if ($checks.eq(0).prop('checked') == true) {
        $genderCheckImg.eq(0).attr('src', '../image/check_all.png');
        $genderCheckImg.eq(1).attr('src', '../image/check.png');
    } else {
        $genderCheckImg.eq(0).attr('src', '../image/check.png');
        $genderCheckImg.eq(1).attr('src', '../image/check_all.png');
    }
});

function send() {
    $joinInputs.trigger("blur");
    console.log($checks.eq(0).prop('checked'));
    if($checks.eq(0).prop('checked') == true || $checks.eq(1).prop('checked') == true){
        $genderInput.css('border', '1px solid #05AE68');
    }else{
        $genderInput.css('border', '1px solid rgb(255, 64, 62)');
    }
    if (joinCheckAll.filter(check => check).length != $joinInputs.length || (($checks.eq(0).prop('checked') == false && $checks.eq(1).prop('checked') == false))) {
        let modalMessage = "모든 정보를 정확히 입력하세요.";
        showWarnModal(modalMessage);
        return;
    }
    $("input[name='memberPassword']").val(btoa($("input[name='memberPassword']").val()));
    $(".check-password").val(btoa($(".check-password").val()));

    $("input[type=radio][name=memberGender]:checked").val();
    document.join.submit();

}

let modalCheck;
function showWarnModal(modalMessage) {
    modalCheck = false;
    $('div.modal-content').html(modalMessage);
    $('div.warn-modal').css('animation', 'popUp 0.5s');
    $('div.modal').css('display', 'flex').hide().fadeIn(500);
    setTimeout(function () {
        modalCheck = true;
    }, 500);
}

$('#member-join').on('click', function () {
    if (modalCheck) {
        $('div.warn-modal').css('animation', 'popDown 0.5s');
        $('div.modal').fadeOut(500);
    }
});