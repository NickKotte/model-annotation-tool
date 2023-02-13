# model-annotation-tool
Tool for adding and annotating 3D models for a large training data set

## Setup
python 3.8
node 16 min

### environment variables
MONGO_URL=mongodb+srv://<user>:<password>@data-annotations.fkizafw.mongodb.net/test

### Start python environment
```bash
# Linux
python3 -m venv py_env
source py_env/bin/activate
```
```cmd
# Windows
python -m venv py_env
.\py_env\Scripts\activate
```
### Install dependencies
```bash
pip install -r requirements.txt
```

### Start node environment
```bash
# Linux
