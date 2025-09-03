function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

function processData() {
    const input = document.getElementById('input').value.trim();
    const outputElement = document.getElementById('output');

    if (!input) {
        showError('入力データを入力してください。');
        return;
    }

    try {
        // JSONLをパース
        const data = JSON.parse(input);

        // データ構造チェック
        if (!data.data || !data.data.params || !data.data.commands) {
            throw new Error('データ構造が正しくありません。paramsとcommandsが必要です。');
        }

        // パラメータを取得
        const params = {};
        data.data.params.forEach(param => {
            params[param.label] = param.value;
        });

        // 必要なパラメータがあるかチェック
        const requiredParams = ['身体', '器用', '精神', '五感', '知力', '魅力', '社会', '運勢'];
        const missingParams = requiredParams.filter(param => !(param in params));
        if (missingParams.length > 0) {
            throw new Error(`必要なパラメータが見つかりません: ${missingParams.join(', ')}`);
        }

        // コマンドを処理
        let commands = data.data.commands;

        // Step 1: パラメータ置換
        requiredParams.forEach(param => {
            const regex = new RegExp(`\\{${param}\\}`, 'g');
            commands = commands.replace(regex, params[param]);
        });

        // Step 2: DA → DM 変換
        // パターン: sDAa を sDM<=s+a に変換
        commands = commands.replace(/(\d+)DA(\d+)/g, (match, s, a) => {
            const sNum = parseInt(s);
            const aNum = parseInt(a);
            const sum = sNum + aNum;
            return `${s}DM<=${sum}`;
        });

        // 結果を作成
        const result = {
            ...data,
            data: {
                ...data.data,
                commands: commands
            }
        };

        // 整形して出力
        outputElement.value = JSON.stringify(result, null, 2);

        // コマンド部分のみを整形して出力
        const commandsOutputElement = document.getElementById('commands-output');
        const formattedCommands = commands
            .split('\n')
            .filter(line => line.trim() !== '')
            .join('\n');
        commandsOutputElement.value = formattedCommands;

    } catch (error) {
        showError(`エラー: ${error.message}`);
        console.error('処理エラー:', error);
    }
}

function copyOutput() {
    const output = document.getElementById('output');
    if (!output.value) {
        showError('コピーする内容がありません。');
        return;
    }

    output.select();
    document.execCommand('copy');

    // 一時的にボタンテキストを変更
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ コピーしました！';
    button.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
    }, 2000);
}

function copyCommandsOutput() {
    const output = document.getElementById('commands-output');
    if (!output.value) {
        showError('コピーする内容がありません。');
        return;
    }

    output.select();
    document.execCommand('copy');

    // 一時的にボタンテキストを変更
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ コピーしました！';
    button.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
    }, 2000);
}

// ページ読み込み時にサンプルデータを設定（デバッグ用）
window.onload = function () {
    // 実際のinput.jsonlの内容があれば自動で読み込み可能
};
