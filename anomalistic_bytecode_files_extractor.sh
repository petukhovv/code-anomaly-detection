#!/usr/bin/env bash
while [[ $# -gt 0 ]]
do
    key="$1"
    case ${key} in
        -i|--anomalies_file)
            anomalies_file="$2"
            shift
            shift
            ;;
        -o|--anomalies_folder)
            anomalies_folder="$2"
            shift
            shift
            ;;
        -c|--code_folder)
            code_folder="$2"
            shift
            shift
            ;;
    esac
done

mkdir -p ${anomalies_folder}

file_counter=1
source_dir="repos_factorized_sparsed"

jq -r '.[] | "\(.[0]):\(.[1])"' ${anomalies_file} | while read item
do
    IFS=':' read -r -a element <<< "$item"

    filepath=${element[0]%.*}
#    filepath=${filepath/$source_dir/}
    filepath=${filepath/\/cst\//\/sources\/}
    deviation=${element[1]}
    filename=$(basename $filepath)
    basepath=$(dirname $filepath)
    filename=${filename%.*}
    deviation=$(printf '%.*f\n' 3 $deviation)
    classname="${filename##*.}"

    echo ${code_folder}${basepath}/${classname}.class

    cp ${code_folder}${basepath}/${classname}.class ${anomalies_folder}/${deviation}_${filename}_${file_counter}.class
    cp ${code_folder}${filepath}.json ${anomalies_folder}/${deviation}_${filename}_${file_counter}.class.json

    let "file_counter++"
done
