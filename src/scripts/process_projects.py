import os
import re
import sys
import json
import subprocess

src_base = 'Portfolio Projects Data'
dst_base = os.path.join('public', 'assets', 'projects')

os.makedirs(os.path.join(dst_base, 'graphic-design'), exist_ok=True)
os.makedirs(os.path.join(dst_base, 'photography'), exist_ok=True)
os.makedirs(os.path.join(dst_base, 'videos'), exist_ok=True)
os.makedirs(os.path.join(dst_base, 'video-posters'), exist_ok=True)

projects = []

def clean_slug(s):
    s = re.sub(r'[^a-zA-Z0-9]+', '_', s).strip('_').lower()
    return s

# 1. PROCESS GRAPHIC DESIGN
gd_dir = os.path.join(src_base, 'Graphic Design')
print('=== Processing Graphic Design Images ===')
for root, dirs, files in os.walk(gd_dir):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            rel = os.path.relpath(root, gd_dir)
            parts = rel.split(os.sep)
            subcat = parts[0] if len(parts) > 0 else 'Design'
            client = parts[1] if len(parts) > 1 else 'Client'
            title = os.path.splitext(f)[0]
            
            slug = clean_slug(f'{subcat}_{client}_{title}')
            out_filename = f'{slug}.webp'
            src_path = os.path.join(root, f)
            dst_path = os.path.join(dst_base, 'graphic-design', out_filename)
            
            # Compress to WebP with max 1280 width/height
            scale_filter = "scale=min(1280\\,iw):-2"
            cmd = ['ffmpeg', '-y', '-i', src_path, '-vf', scale_filter, '-quality', '82', dst_path]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0:
                orig_kb = os.path.getsize(src_path) / 1024
                new_kb = os.path.getsize(dst_path) / 1024
                print(f'[GD OK] {client} - {title} ({orig_kb:.0f}KB -> {new_kb:.0f}KB)')
                
                clean_client = client.replace('_', ' ')
                clean_title = title.replace('_', ' ')
                
                projects.append({
                    'id': f'gd-{slug}',
                    'title': f'{clean_client}: {clean_title}',
                    'client': clean_client,
                    'category': 'graphic-design',
                    'subCategory': subcat,
                    'type': 'Graphic Design',
                    'image': f'/assets/projects/graphic-design/{out_filename}',
                    'tags': ['GRAPHIC DESIGN', subcat.upper(), clean_client.upper()]
                })
            else:
                print(f'[GD ERR] {src_path}: {res.stderr[:200]}')

# 2. PROCESS PHOTOGRAPHY
photo_dir = os.path.join(src_base, 'Photography')
print('\n=== Processing Photography Images ===')
for f in os.listdir(photo_dir):
    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
        title = os.path.splitext(f)[0]
        slug = clean_slug(f'photo_{title}')
        out_filename = f'{slug}.webp'
        src_path = os.path.join(photo_dir, f)
        dst_path = os.path.join(dst_base, 'photography', out_filename)
        
        scale_filter = "scale=min(1400\\,iw):-2"
        cmd = ['ffmpeg', '-y', '-i', src_path, '-vf', scale_filter, '-quality', '85', dst_path]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            orig_kb = os.path.getsize(src_path) / 1024
            new_kb = os.path.getsize(dst_path) / 1024
            print(f'[PHOTO OK] {title} ({orig_kb:.0f}KB -> {new_kb:.0f}KB)')
            projects.append({
                'id': f'photo-{slug}',
                'title': f'Architecture & Street RAW // {title}',
                'client': 'jerrydotdng Archive',
                'category': 'photography',
                'subCategory': 'RAW Photography',
                'type': 'Photography',
                'image': f'/assets/projects/photography/{out_filename}',
                'tags': ['PHOTOGRAPHY', 'RAW DNG', 'ARCHITECTURE', 'STREET']
            })

# 3. PROCESS VIDEOS (POSTERS & OPTIMIZED WEBM/MP4)
video_dir = os.path.join(src_base, 'Video Editing')
print('\n=== Processing Commercial Videos & Posters ===')
for root, dirs, files in os.walk(video_dir):
    for f in files:
        if f.lower().endswith(('.mp4', '.mov')):
            rel = os.path.relpath(root, video_dir)
            client = rel.replace(os.sep, ' ') if rel != '.' else 'Client'
            title = os.path.splitext(f)[0]
            slug = clean_slug(f'video_{client}_{title}')
            
            src_path = os.path.join(root, f)
            poster_filename = f'{slug}_poster.webp'
            video_filename = f'{slug}.mp4'
            dst_poster = os.path.join(dst_base, 'video-posters', poster_filename)
            dst_video = os.path.join(dst_base, 'videos', video_filename)
            
            # 3A. Extract high quality poster frame at 1.5s
            poster_cmd = [
                'ffmpeg', '-y', '-ss', '00:00:01.500', '-i', src_path,
                '-vframes', '1', '-vf', 'scale=min(1080\\,iw):-2', '-quality', '85', dst_poster
            ]
            subprocess.run(poster_cmd, capture_output=True)
            
            # 3B. Compress video to 720p H.264 MP4 with faststart for instant playback
            # If GARV after-film (large 2min video), use crf 28. For shorter reels, use crf 26.
            crf = '28' if 'AFTER-FILM' in f.upper() else '26'
            video_cmd = [
                'ffmpeg', '-y', '-i', src_path,
                '-vf', 'scale=min(720\\,iw):-2',
                '-c:v', 'libx264', '-crf', crf, '-preset', 'faster',
                '-c:a', 'aac', '-b:a', '96k',
                '-movflags', '+faststart',
                dst_video
            ]
            res_vid = subprocess.run(video_cmd, capture_output=True, text=True)
            if res_vid.returncode == 0:
                orig_mb = os.path.getsize(src_path) / (1024 * 1024)
                new_mb = os.path.getsize(dst_video) / (1024 * 1024)
                print(f'[VID OK] {client} - {title} ({orig_mb:.1f}MB -> {new_mb:.1f}MB)')
                
                clean_client = client.strip()
                clean_title = title.strip()
                
                projects.append({
                    'id': f'vid-{slug}',
                    'title': f'{clean_client}: {clean_title}',
                    'client': clean_client,
                    'category': 'video-editing',
                    'subCategory': 'Commercial Video' if 'AFTER-FILM' not in f.upper() else 'Festival After-Film',
                    'type': 'Video Editing',
                    'image': f'/assets/projects/video-posters/{poster_filename}',
                    'video': f'/assets/projects/videos/{video_filename}',
                    'tags': ['COMMERCIAL VIDEO', 'PREMIERE PRO', clean_client.upper(), 'AFTER EFFECTS']
                })
            else:
                print(f'[VID ERR] {f}: {res_vid.stderr[:200]}')

# Save comprehensive project list to JSON and JS
output_json = os.path.join('src', 'data', 'projectsData.json')
with open(output_json, 'w', encoding='utf-8') as out_f:
    json.dump(projects, out_f, indent=2)

print(f'\nFinished processing all portfolio projects! Total: {len(projects)}')
