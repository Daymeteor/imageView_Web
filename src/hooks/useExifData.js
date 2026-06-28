import { useState, useEffect, useRef } from 'react';
import ExifReader from 'exifreader';

export default function useExifData(image) {
  const [exif, setExif] = useState(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!image?.file || doneRef.current) return;
    doneRef.current = true;

    (async () => {
      try {
        const tags = await ExifReader.load(image.file, { expanded: true });
        const result = {};

        const dt = tags.exif?.DateTimeOriginal?.description || tags.exif?.DateTime?.description;
        if (dt) {
          const m = dt.match(/(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
          if (m) {
            const d = new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +m[6]);
            result.date = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
            const h = d.getHours();
            result.timeOfDay = h>=5&&h<7?'破晓':h>=7&&h<10?'早晨':h>=10&&h<14?'正午':h>=14&&h<17?'午后':h>=17&&h<19?'黄昏':h>=19&&h<21?'入夜':'深夜';
            const mo = d.getMonth()+1;
            result.season = mo>=3&&mo<=5?'春':mo>=6&&mo<=8?'夏':mo>=9&&mo<=11?'秋':'冬';
          }
        }

        const make = tags.exif?.Make?.description?.trim();
        const model = tags.exif?.Model?.description?.trim();
        if (make || model) result.camera = [make, model].filter(Boolean).join(' ');

        result.lens = tags.exif?.LensModel?.description?.trim();
        const fNum = tags.exif?.FNumber?.description;
        if (fNum) result.aperture = `f/${fNum}`;
        const et = tags.exif?.ExposureTime?.description;
        if (et) result.shutter = `${et}s`;
        const iso = tags.exif?.ISOSpeedRatings?.description;
        if (iso) result.iso = parseInt(iso, 10) || iso;
        const fl = tags.exif?.FocalLength?.description;
        if (fl) result.focalLength = `${fl}mm`;

        const latTag = tags.exif?.GPSLatitude;
        const lonTag = tags.exif?.GPSLongitude;
        if (latTag && lonTag) {
          const parse = (desc, ref) => {
            const dms = String(desc).match(/(\d+)[°d]\s*(\d+)[′']?\s*([\d.]+)/);
            if (!dms) return null;
            let dec = +dms[1] + +dms[2]/60 + +dms[3]/3600;
            if (String(ref).trim() === 'S' || String(ref).trim() === 'W') dec = -dec;
            return dec;
          };
          const lat = parse(latTag.description, tags.exif.GPSLatitudeRef?.value?.[0]);
          const lon = parse(lonTag.description, tags.exif.GPSLongitudeRef?.value?.[0]);
          if (lat !== null && lon !== null) {
            result.gps = `${Math.abs(lat).toFixed(4)}°${lat>=0?'N':'S'} ${Math.abs(lon).toFixed(4)}°${lon>=0?'E':'W'}`;
          }
        }

        result.hasData = Object.keys(result).length > 0;
        setExif(result);
      } catch { setExif({ hasData: false }); }
    })();
  }, [image?.id]);

  return exif;
}
