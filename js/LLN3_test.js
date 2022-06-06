//GASのAPIのURL（各自変更してください。）
const endpoint =
    "https://script.google.com/macros/s/AKfycbyowQB4GXEKCmB3J4tKjSUjzu7chkQ7JUlzYSLEJ6oPwsZy-L905ntf6U5DWUSlYEz-/exec";
    
    //APIを使って非同期データを取得する
    fetch(endpoint)
    .then(response => response.json())
    //成功した処理
    .then(data => {
        //JSONから配列に変換
        const object = data;
        let array1 = []; // Q1対応する解答だけを格納する
        let array2 = []; // Q2対応する解答だけを格納する
        
        //追加部分////////////
        let WhoAndQ1 = new Object(); // 解答者番号と解答を対応させて格納
        let WhoAndQ2 = new Object(); // 同上
        //////////////////////


        for(i=0;i<object.length;i++){
            array1.push([object[i]['Q1']]);
            array2.push([object[i]['Q2']]);

            //追加部分///////////////////////
            let key = object[i]['解答者番号']; // 解答者番号をkeyにして
            WhoAndQ1[key] = object[i]['Q1']; // Q1の解答と結び付ける
            WhoAndQ2[key] = object[i]['Q2']; // Q2の解答と結び付ける
            ////////////////////////////////
        }

        for(i=0;i<array1.length;i++){
            var Answer1List = document.createElement('li'); // <li></li>を作る
            Answer1List.textContent = array1[i]; // <li></li>の中を書き換える
            document.getElementById('listq1').appendChild(Answer1List); // <ul id="list"></ul>にarray1[i]を挿入
        }

        for(i=0;i<array2.length;i++){
            var Answer2List = document.createElement('li'); // <li></li>を作る
            Answer2List.textContent = array2[i]; // <li></li>の中を書き換える
            document.getElementById('listq2').appendChild(Answer2List); // <ul id="list"></ul>にarray2[i]を挿入
        }

        //追加部分////////////////
        $(function(){
            var $input = $('#field-name'); // inputされた解答者番号に対して
            var $output = $('#output');
            $input.on('change',function(event){
                var value = $input.val();
                if(WhoAndQ1[value]){
                    $output.text(WhoAndQ1[value]); // 対応する解答をoutput
                }
                else{
                    $output.text("入力された解答者番号では送信されていません"); // データがなかった場合はこれを表示
                }
            });
        });

        $(function(){
            var $input2 = $('#field-name2'); // inputされた解答者番号に対して
            var $output2 = $('#output2');
            $input2.on('change',function(event){
                var value2 = $input2.val();
                if(WhoAndQ2[value2]){
                    $output2.text(WhoAndQ2[value2]); // 対応する解答をoutput
                }
                else{
                    $output2.text("入力された解答者番号では送信されていません"); // データがなかった場合はこれを表示
                }
            });
        });
        ////////////////////////
    });


/*
//GASのAPIのURL（各自変更してください。）
const endpoint =
    "https://script.google.com/macros/s/AKfycbyowQB4GXEKCmB3J4tKjSUjzu7chkQ7JUlzYSLEJ6oPwsZy-L905ntf6U5DWUSlYEz-/exec";
    
    //APIを使って非同期データを取得する
    fetch(endpoint)
    .then(response => response.json())
    //成功した処理
    .then(data => {
        //JSONから配列に変換
        const object = data;
        let array1 = []; // Q1対応する解答だけを格納する

        for(i=0;i<object.length;i++){
            //inputタグそれぞれに取得したデータを設定
            $('input').each(function (index, element) {
                array1.push([object[i][$(element).attr('name')]])
            });
        }
        
        for(i=0;i<array1.length;i++){
            var Answer1List = document.createElement('li'); // <li></li>を作る
            Answer1List.textContent = array1[i]; // <li></li>の中を書き換える
            document.getElementById('list').appendChild(Answer1List); // <ul id="list"></ul>にarray1[i]を挿入
        }
    });
*/


/*
//GASのAPIのURL（各自変更してください。）
const endpoint =
    "https://script.google.com/macros/s/AKfycbyowQB4GXEKCmB3J4tKjSUjzu7chkQ7JUlzYSLEJ6oPwsZy-L905ntf6U5DWUSlYEz-/exec";
    
    //APIを使って非同期データを取得する
    fetch(endpoint)
    .then(response => response.json())
    //成功した処理
    .then(data => {
        //JSONから配列に変換
        const object = data;
        let array = []; // 対応する解答だけを格納する
        for(i=0;i<object.length;i++){
            //inputタグそれぞれに取得したデータを設定
            $('input').each(function (index, element) {
                if (object[0][$(element).attr('name')]) {
                    //$(element).val([object[0][$(element).attr('name')]]);
                    array.push([object[i][$(element).attr('name')]])
                }
            });
        }
        alert(array); // 各生徒の解答
        for(i=0;i<5;i++){
            var AnswerList = document.createElement('li');
            AnswerList.textContent = array[i];
            document.getElementById('list').appendChild(AnswerList);
        }
    });
*/