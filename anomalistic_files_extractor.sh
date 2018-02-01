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

jq -r '.[] | "\(.[0]):\(.[1])"' ${anomalies_file} | while read item
do
    IFS=':' read -r -a element <<< "$item"

    filename="${element[0]%.*}"
    deviation="${element[1]%.*}"

    cp ${code_folder}/${filename} ${anomalies_folder}/${deviation}_${file_counter}.kt

    let "file_counter++"
done
