import { useState, useCallback } from 'react';

export const useDicts = () => {
    const [dicts, setDicts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDict = useCallback(async (dictKey) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:8000/api/dicts/${dictKey}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки справочника: ${response.status}`);
            }

            const data = await response.json();

            // Создаем маппинг self_id -> value
            const dictMap = {};
            data.forEach(item => {
                dictMap[item.self_id] = item.value;
            });

            setDicts(prev => ({
                ...prev,
                [dictKey]: dictMap
            }));

            return dictMap;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDictValue = useCallback((dictKey, selfId) => {
        return dicts[dictKey]?.[selfId] || selfId;
    }, [dicts]);

    const getDictOptions = useCallback((dictKey) => {
        const dict = dicts[dictKey];

        if (!dict) return [];

        // Возвращаем ТОЛЬКО опции из справочника, без "Все статусы"
        return Object.entries(dict).map(([selfId, value]) => ({
            value: selfId,
            label: value
        }));
    }, [dicts]);

    return {
        dicts,
        loading,
        error,
        fetchDict,
        getDictValue,
        getDictOptions
    };
};