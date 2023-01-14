
function showEmailModal(product_id){
    $("#signupModalLabel").text($("#name"+product_id).val())
    $("#form_product_id").val(product_id)
    $("#form_rapyd_product_id").val($("#rapyd_product_id"+product_id).val())
    $("#form_product_type").val($("#type"+product_id).val())
    $("#form_price").val($("#price"+product_id).val())
    $('#signupModal').modal('show')
}

function closeEmailModal(){
    $('#signupModal').modal('hide')
}

function showCancelSubModal(){
    $('#CancelSubModal').modal('show')
}

function closeCancelSubModal(){
    $('#CancelSubModal').modal('hide')
}

$(document).ready(function() {

    $("#getPaymentMethodFields").click(function(){
        $("#getPaymentMethodFieldsLoading").show()
        $("#getPaymentMethodFields").hide()

        $.ajax('/payment-method-fields', {
            type: 'POST',
            data: {
                'product_id': $("#form_product_id").val(),
                'rapyd_product_id': $("#form_rapyd_product_id").val(),
                'price': $("#form_price").val(),
                'customer_email': $("#cust_email_address").val(),
                'full_name': $("#cust_full_name").val(),
                'product_type': $("#form_product_type").val(),
                'payment_method': $("#cust_payment_method").val()
            }, 
            success: async function (data, status, xhr) {
                var fields = data.data.fields
                var html = ''

                await fields.forEach(field => {
                    if (field.instructions) {
                        html += `<div class="form-group">
                                    <label for="field${field.name}">${field.instructions}</label>
                                    <input type="text" class="form-control" id="field${field.name}" placeholder="${field.instructions}">
                                </div>`
                    }
                });

                $("#paymentMethodFieldsDiv").append(html)
                $("#getPaymentMethodFieldsLoading").hide()
                $("#getPaymentMethodFields").hide()

            },
            error: function (jqXhr, textStatus, errorMessage) {
                $("#getPaymentMethodFieldsLoading").hide()
                $("#getPaymentMethodFields").show()
                console.log('Error' + errorMessage);
            }
        });
    });


    $("#confirmSubscription").click(function(){
        $("#confirmSubscriptionLoading").show()
        $("#confirmSubscription").hide()

        $.ajax('/create-subscription', {
            type: 'POST',
            data: {
                'product_id': $("#form_product_id").val(),
                'rapyd_product_id': $("#form_rapyd_product_id").val(),
                'price': $("#form_price").val(),
                'customer_email': $("#cust_email_address").val(),
                'full_name': $("#cust_full_name").val(),
                'product_type': $("#form_product_type").val(),
                'payment_method': $("#cust_payment_method").val(),

                'fieldnumber': $("#fieldnumber").val(),
                'fieldexpiration_month': $("#fieldexpiration_month").val(),
                'fieldexpiration_year': $("#fieldexpiration_year").val(),
                'fieldname': $("#fieldname").val(),
                'fieldcvv': $("#fieldcvv").val()
            }, 
            success: function (data, status, xhr) {

                $("#subscription-form").hide()
                $("#confirmSubscriptionLoading").hide()
                $("#subscription-created-success").show()

                setTimeout(location.reload(), 5000);

            },
            error: function (data, textStatus, errorMessage) {
                $("#confirmSubscriptionLoading").hide()
                $("#confirmSubscription").show()
                $("#subscription-created-error").text(data.responseJSON.message)
                $("#subscription-created-error").show()
            }
        });
    });

    $("#cancelSubscriptionSubmit").click(function(){
        $("#cancelSubscriptionLoading").show()
        $("#cancelSubscriptionSubmit").hide()

        $.ajax('/cancel-subscription', {
            type: 'POST',
            data: {
                'customer_email': $("#cust_email_address_cs").val(),
            }, 
            success: function (data, status, xhr) {

                $("#cancel-subscription-form").hide()
                $("#cancelSubscriptionLoading").hide()
                $("#subscription-canceled-success").show()

            },
            error: function (data, textStatus, errorMessage) {
                $("#cancelSubscriptionLoading").hide()
                $("#cancelSubscriptionSubmit").show()
                $("#subscription-canceled-error").text(data.responseJSON.message)
                $("#subscription-canceled-error").show()
            }
        });
    });

});

