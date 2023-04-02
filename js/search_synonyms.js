// 确定指定词汇所属的原子词组
function identify_atomic_group(keyword) {
	var atomic_groups = new Array();
	for (top_type_name in synonyms) {
		var top_type = synonyms[top_type_name];
		for (middle_type_name in top_type) {
			var middle_type = top_type[middle_type_name];
			for (bottom_type_name in middle_type) {
				var bottom_type = middle_type[bottom_type_name];
				for (group_name in bottom_type) {
					var group = bottom_type[group_name];
					for (atomic_group_name in group) {
						var atomic_group = group[atomic_group_name];
						var words = atomic_group['words'];
						for (word of words) {
							if (word == keyword) {
								atomic_groups.push([
									top_type,
									middle_type,
									bottom_type,
									group,
									atomic_group,
								])
								break;
							}
						}
					}
				}
			}
		}
	}
	return atomic_groups;
}


function get_all_words(group) {
	if (group.hasOwnProperty("words")) {
		return new Set(group["words"]);
	}
	var words = new Set();
	for (name in group) {
		for (w of get_all_words(group[name])) {
			words.add(w);
		}
	}
	return words;
}


// 搜索指定词汇的近义词
// distance 为 0 时认为只有它自己是近义词
// distance 为 1 时认为只有相同 atomic_group 的词汇是近义词
// distance 为 2 时认为只有相同 group 的词汇是近义词
// 依次类推。通常当 distance 大于 3 时输出数量过多，没有实际意义。
function search_synonyms(keyword, distance=2, same_length=false) {
	var synonyms = new Set();
	synonyms.add(keyword);    // 一个词一定是它自己的近义词
	if (distance == 0) {
		return synonyms;
	}
	var atomic_groups = identify_atomic_group(keyword);
	for (atomic_group of atomic_groups) {
		var index = 5 - distance;
		if (index <= 0) {
			index = 0;
		}
		for (w of get_all_words(atomic_group[index])) {
			if (same_length == false || keyword.length == w.length) {
				synonyms.add(w);
			}
		}
	}
	return synonyms;
}
