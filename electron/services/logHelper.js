import fs from 'fs';
import path from 'path';
import { app, shell } from 'electron';
import log from 'electron-log';
import AdmZip from 'adm-zip';

const openLogPath = () => {
    shell.openPath(app.getPath('logs'));
}

/**
 * @param {string} content
 */
const cleanLogs = (content) => {
    const matchs = {
        mobile: /\bmobile=1[3-9]\d{9}/g,
        token: /\btoken=[A-Za-z0-9]+/g,
        key: /key=[A-Za-z0-9]+/g,
        userid: /\buserid=\d+/g
    }
    Object.keys(matchs).forEach((key) => {
        const match = content.match(matchs[key]);
        if (match) {
            content = content.replace(match[0], `${key}=***`);
        }
    });
    return content;
}

const exportLog = () => {
    const logFile = path.join(app.getPath('logs'), 'main.log');
    if (!fs.existsSync(logFile)) {
        log.warn('日志文件不存在');
        return;
    }
    try {
        const zip = new AdmZip();
        const logContent = fs.readFileSync(logFile, 'utf-8');
        const cleanedContent = cleanLogs(logContent);
        zip.addFile('main.log', cleanedContent);
        const buffer = zip.toBuffer();
        return buffer;
    } catch (err) {
        log.error('导出日志文件失败', err);
        throw err;
    }
}

export { openLogPath, exportLog };
