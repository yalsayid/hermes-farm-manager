import { app } from 'electron';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { Printer } from '@main/modules/printers/types';
import { spawn } from 'child_process';

const ffmpegProcesses: { [key: string]: ReturnType<typeof spawn> } = {};

export const startStream = (printer: Printer) => {
    const url = `rtsps://bblp:${printer.access_code}@${printer.ip_address}:322/streaming/live/1`;
    const outputPath = path.join(app.getPath('temp'), 'printer_streams', `printer_${printer.serial_number}_stream.m3u8`)

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const args = [
        `-loglevel`, `quiet`,
        `-fflags`, `nobuffer`,
        `-rtsp_transport`, `tcp`,
        `-i`, `${url}`,
        "-vcodec", "copy",
        "-copyts",
        "-tune",
        "zerolatency",
        "-an",
        "-hls_flags", "delete_segments+append_list",
        "-segment_list_flags", "+live",
        `-f`, `hls`,
        `-hls_time`, `1`,
        `-hls_list_size`, `3`,
        `-hls_segment_type`, `mpegts`,
        `${outputPath}`
    ];


    const ffmpeg = spawn(ffmpegPath, args);
    ffmpegProcesses[printer.id] = ffmpeg;

    ffmpeg.stdout.on('data', (data) => {
        console.log('FFmpeg output:', data);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error('FFmpeg error:', data.toString());
    });

    ffmpeg.on('error', (error) => {
        console.error(`FFmpeg error: ${error.message}`);
    });

    ffmpeg.on('close', (code) => {
        if (code !== 0) {
            console.error(`FFmpeg process closed with code ${code} `);
        } else {
            console.log(`FFmpeg process closed successfully`);
        }
    });

    return outputPath;
};

export const stopAllStreams = () => {
    for (const key in ffmpegProcesses) {
        ffmpegProcesses[key].kill();
        delete ffmpegProcesses[key];
    }
};