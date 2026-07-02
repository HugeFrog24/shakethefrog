'use client';

import { useRef, useEffect, useCallback } from 'react';

const AUDIO_URL = '/audio/starley_call_on_me.ogg';
const FADE_IN_SEC = 0.1;
const FADE_OUT_SEC = 0.8;
const QUIET_TIMEOUT_MS = 1000;
const PLAY_GAIN = 0.7;
// exponentialRampToValueAtTime can't reach 0; use a tiny positive target
const NEAR_ZERO = 0.0001;

export function useShakeAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const quietTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fadeOutAndStop = useCallback(() => {
    const ctx = ctxRef.current;
    const source = sourceRef.current;
    const gain = gainRef.current;
    if (!ctx || !source || !gain) return;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(NEAR_ZERO, now + FADE_OUT_SEC);

    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    // Defer source.stop() via setTimeout (not source.stop(time)) so a bump
    // arriving mid-fade can cancel it and ramp back up without restarting.
    stopTimeoutRef.current = setTimeout(() => {
      if (sourceRef.current === source) {
        try { source.stop(); } catch { /* already stopped */ }
        source.disconnect();
        sourceRef.current = null;
        gainRef.current = null;
      }
      stopTimeoutRef.current = null;
    }, FADE_OUT_SEC * 1000 + 50);
  }, []);

  const bump = useCallback(async () => {
    if (globalThis.window === undefined) return;

    if (!ctxRef.current) {
      try {
        ctxRef.current = new AudioContext();
      } catch (err) {
        console.error('AudioContext creation failed:', err);
        return;
      }
    }

    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        console.error('AudioContext resume failed:', err);
        return;
      }
    }

    if (!bufferRef.current) {
      try {
        const res = await fetch(AUDIO_URL);
        const arr = await res.arrayBuffer();
        bufferRef.current = await ctx.decodeAudioData(arr);
      } catch (err) {
        console.error('Audio decode failed:', err);
        return;
      }
    }

    if (quietTimerRef.current) clearTimeout(quietTimerRef.current);
    quietTimerRef.current = setTimeout(fadeOutAndStop, QUIET_TIMEOUT_MS);

    if (sourceRef.current && gainRef.current) {
      // Already playing or mid-fade-out: cancel any scheduled stop and
      // ramp gain back up to PLAY_GAIN. Loop position is preserved.
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      const now = ctx.currentTime;
      const gainParam = gainRef.current.gain;
      gainParam.cancelScheduledValues(now);
      gainParam.setValueAtTime(gainParam.value, now);
      gainParam.linearRampToValueAtTime(PLAY_GAIN, now + FADE_IN_SEC);
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.loop = true;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(NEAR_ZERO, now);
    gain.gain.linearRampToValueAtTime(PLAY_GAIN, now + FADE_IN_SEC);

    source.connect(gain).connect(ctx.destination);
    source.start(now);

    sourceRef.current = source;
    gainRef.current = gain;
  }, [fadeOutAndStop]);

  useEffect(() => {
    return () => {
      if (quietTimerRef.current) clearTimeout(quietTimerRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      const source = sourceRef.current;
      if (source) {
        try { source.stop(); } catch { /* already stopped */ }
        source.disconnect();
      }
      const ctx = ctxRef.current;
      if (ctx) ctx.close().catch(() => { /* ignore */ });
    };
  }, []);

  return bump;
}
