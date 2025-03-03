import { getAnthropicAPIKey, getOpenAIAPIKey } from "@/app/helpers/llmConnector";
import { useAppStore } from "@/app/store";
import {
  defaultAnthropicModel,
  defaultModel,
  defaultOpenAIModel,
  endpointNames,
  endpoints,
  hasAnthropicKey,
  hasOpenAIKey,
  LLMModel,
  LLMModelEndpoint,
  modelNames,
} from "@/app/types/llm";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  messageCount: number;
};

export const SelectModel = ({ messageCount }: Props) => {
  const model = useAppStore((state) => state.model);
  const setModel = useAppStore((state) => state.setModel);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKeys, setApiKeys] = useState<Record<LLMModelEndpoint, string>>({
    [LLMModelEndpoint.CLAUDE]: "",
    [LLMModelEndpoint.OPENAI]: "",
  });

  const updateAnthropicAPIKey = () => {
    setApiKeys((keys) => ({ ...keys, claude: getAnthropicAPIKey() }));
  };

  const updateOpenAIAPIKey = () => {
    setApiKeys((keys) => ({ ...keys, openai: getOpenAIAPIKey() }));
  };

  useEffect(() => {
    if (model && model !== LLMModel.NOT_SET) {
      if (endpoints[model] === LLMModelEndpoint.CLAUDE) {
        if (hasAnthropicKey()) {
          updateAnthropicAPIKey();
        }
      }
      if (endpoints[model] === LLMModelEndpoint.OPENAI) {
        if (hasOpenAIKey()) {
          updateOpenAIAPIKey();
        }
      }
    } else {
      if (hasAnthropicKey()) {
        setModel(defaultAnthropicModel);
      } else if (hasOpenAIKey()) {
        setModel(defaultOpenAIModel);
      } else {
        setModel(defaultModel);
      }
    }
    setLoading(false);
  }, [model, setModel, messageCount]);

  return (
    <div className="flex flex-row gap-2 mt-2">
      <div className="dropdown dropdown-top">
        <div tabIndex={0} role="button" className="btn m-1">
          {modelNames[model]} <ChevronDown size={16} />
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
          {Object.entries(endpointNames).map(([endpoint, endpointName]) => (
            <li key={endpoint}>
              <h2 className="menu-title">{endpointName}</h2>
              <ul>
                {Object.entries(modelNames)
                  .filter(([id]) => endpoints[id as LLMModel] === endpoint)
                  .map(([id, name]) => (
                    <li onClick={() => setModel(id as LLMModel)} key={id}>
                      <a className={id === model ? "menu-active" : ""}>{name}</a>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {!loading && !apiKeys[endpoints[model]] && (
        <div className="alert alert-info flex-1">
          <span>You need to add an {endpointNames[endpoints[model]]} API key to use this model.</span>
          <button
            className="btn btn-outline btn-sm -m-2 ml-auto whitespace-nowrap"
            onClick={() => {
              if (endpoints[model] === LLMModelEndpoint.CLAUDE) {
                updateAnthropicAPIKey();
              }
              if (endpoints[model] === LLMModelEndpoint.OPENAI) {
                updateOpenAIAPIKey();
              }
            }}
          >
            Add {endpointNames[endpoints[model]]} API Key
          </button>
        </div>
      )}
    </div>
  );
};
