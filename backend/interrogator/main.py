from PIL import Image
from clip_interrogator import Config, Interrogator
from os import path

config = Config()
config.blip_num_beams = 64
config.blip_offload = False
config.clip_model_name = "ViT-L-14/openai"
config.chunk_size = 2048
config.flavor_intermediate_count = 2048
config.quiet = True
ci = Interrogator(config)

while True:
    image_path = input("Enter image path: ")
    if not path.exists(image_path):
        print('404: ', image_path)
        continue
 
    try:
        image = Image.open(image_path).convert('RGB')
    except:
        print("500")
        continue
    
    best = ci.interrogate(image)
    # fast = ci.interrogate_fast(image)
    
    print(best)
    # print("Fast: ", fast)