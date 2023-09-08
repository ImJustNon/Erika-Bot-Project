module.exports = {
    youtubeThumbnail: async(url, quality) =>{
        if(url){
            var video_id, thumbnail, result;
            if(result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)){
                video_id = result.pop();
            }
            else if(result = url.match(/youtu.be\/(.{11})/)){
                video_id = result.pop();
            }
    
            if(video_id){
                if(typeof quality == "undefined"){
                    quality = 'high';
                }
            
                var quality_key = 'maxresdefault'; // Max quality
                if(quality == 'low'){
                    quality_key = 'sddefault';
                }else if(quality == 'medium'){
                    quality_key = 'mqdefault';
                } else if (quality == 'high') {
                    quality_key = 'hqdefault';
                }
    
                var thumbnail = "http://img.youtube.com/vi/"+video_id+"/"+quality_key+".jpg";
                return thumbnail;
            }
        }
    }
};