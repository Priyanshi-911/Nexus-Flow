import { 
  Zap, ArrowRightLeft, Database, Calculator, MessageSquare, Mail, 
  FileSpreadsheet, Layers, Search, Globe, Rss, Fingerprint, 
  Variable, FileJson, Calendar, Flame, Send
} from 'lucide-react';

export const CATEGORY_COLORS: Record<string, any> = {
  trigger: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', accent: 'bg-amber-500' },
  web3:   { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', accent: 'bg-indigo-500' },
  data:   { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', accent: 'bg-emerald-500' },
  logic:  { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', accent: 'bg-slate-500' },
  notify: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', accent: 'bg-rose-500' },
  ops:    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', accent: 'bg-blue-500' },
};

export const NODE_TYPES: Record<string, any> = {
  
  // --- TRIGGERS ---
  'webhook': { 
    label: 'Webhook Trigger', category: 'trigger', icon: Zap,
    inputs: [{ name: 'triggerId', label: 'Webhook ID', type: 'text', readOnly: true }] 
  },
  'sheets': {
    label: 'G-Sheet Watcher', category: 'trigger', icon: FileSpreadsheet, 
    inputs: [
      { name: 'colIndex', label: 'Column Index (0=A)', type: 'number', placeholder: '4' },
      { name: 'value', label: 'Trigger Value', type: 'text', placeholder: 'Pending' }
    ]
  },

  // --- WEB3 ---
  'transfer': { 
    label: 'Transfer Token', category: 'web3', icon: Send,
    inputs: [
      { name: 'toAddress', label: 'To Address', type: 'text', placeholder: '0x... or {{Wallet}}' },
      { name: 'amount', label: 'Amount', type: 'text', placeholder: '1.5' },
      { name: 'currency', label: 'Token Symbol', type: 'text', placeholder: 'ETH, USDC...' },
      // Optional: Backend defaults to 18 if missing
      { name: 'decimals', label: 'Decimals (Opt)', type: 'number', placeholder: '18', required: false },
    ]
  },
  'swap_uniswap': { 
    label: 'Uniswap Swap', category: 'web3', icon: ArrowRightLeft,
    inputs: [
      { name: 'tokenIn', label: 'Token In', type: 'text', placeholder: '0x...' },
      { name: 'tokenOut', label: 'Token Out', type: 'text', placeholder: '0x...' },
      { name: 'amountIn', label: 'Amount', type: 'text', placeholder: '100' },
      { name: 'recipient', label: 'Recipient', type: 'text', placeholder: '0x...' },
      { name: 'tokenInDecimals', label: 'In Decimals', type: 'number', placeholder: '18', required: false },
    ]
  },
  'aave_supply': { 
    label: 'Aave Supply', category: 'web3', icon: Layers,
    inputs: [
      { name: 'asset', label: 'Asset Address', type: 'text', placeholder: '0x...' },
      { name: 'amount', label: 'Amount', type: 'text' },
      { name: 'onBehalfOf', label: 'On Behalf Of', type: 'text', placeholder: '0x...' },
    ]
  },
  'read_contract': { 
    label: 'Read Contract', category: 'web3', icon: Search,
    inputs: [
      { name: 'contractAddress', label: 'Contract', type: 'text' },
      { name: 'functionSignature', label: 'Function Sig', type: 'text', placeholder: 'balanceOf(address)' },
      // Optional: Functions like totalSupply() have no args
      { name: 'args', label: 'Args (Comma Sep)', type: 'text', placeholder: '0x123', required: false },
    ]
  },
  'write_contract': { 
    label: 'Write Contract', category: 'web3', icon: Fingerprint,
    inputs: [
      { name: 'contractAddress', label: 'Contract', type: 'text' },
      { name: 'functionSignature', label: 'Function Sig', type: 'text', placeholder: 'approve(address,uint256)' },
      { name: 'args', label: 'Args (Comma Sep)', type: 'text', required: false },
      // Optional: Non-payable functions don't need value
      { name: 'value', label: 'ETH Value (Wei)', type: 'text', placeholder: '0', required: false },
    ]
  },
  'resolve_ens': { 
    label: 'Resolve ENS', category: 'web3', icon: Search,
    inputs: [{ name: 'domain', label: 'ENS Domain', type: 'text', placeholder: 'vitalik.eth' }] 
  },
  'get_gas_price': { 
    label: 'Get Gas Price', category: 'data', icon: Flame,
    inputs: [] 
  },

  // --- DATA ---
  'get_price': { 
    label: 'Get Token Price', category: 'data', icon: Database,
    inputs: [{ name: 'tokenId', label: 'Coingecko ID', type: 'text', placeholder: 'ethereum' }] 
  },
  'http_request': { 
    label: 'HTTP Request', category: 'data', icon: Globe,
    inputs: [
      { name: 'url', label: 'URL', type: 'text' },
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
      // Optional: GET requests often have no body
      { name: 'body', label: 'Body (JSON)', type: 'textarea', required: false },
      { name: 'headers', label: 'Headers (JSON)', type: 'textarea', required: false },
    ]
  },
  'read_rss': { 
    label: 'Read RSS Feed', category: 'data', icon: Rss,
    inputs: [{ name: 'url', label: 'RSS URL', type: 'text' }] 
  },

  // --- LOGIC ---
  'math_operation': { 
    label: 'Math Operator', category: 'logic', icon: Calculator,
    inputs: [
      { name: 'valueA', label: 'Value A', type: 'text' },
      { name: 'operation', label: 'Operation', type: 'select', options: ['add', 'subtract', 'multiply', 'divide', 'percent'] },
      { name: 'valueB', label: 'Value B', type: 'text' },
    ]
  },
  'transform_data': { 
    label: 'Transform Data', category: 'logic', icon: Variable,
    inputs: [
      { name: 'value', label: 'Input Value', type: 'text' },
      { name: 'operation', label: 'Operation', type: 'select', options: ['upper', 'lower', 'replace', 'parse_number'] },
      // Optional: 'upper'/'lower' need no param
      { name: 'param', label: 'Param (e.g. search)', type: 'text', required: false },
      { name: 'replaceValue', label: 'Replace With', type: 'text', required: false },
    ]
  },
  'json_extract': { 
    label: 'JSON Extractor', category: 'logic', icon: FileJson,
    inputs: [
      { name: 'data', label: 'JSON Data', type: 'text', placeholder: '{{HTTP_RESPONSE}}' },
      { name: 'path', label: 'Path', type: 'text', placeholder: 'data.price' },
      // Optional: Backend has a default output name
      { name: 'outputVar', label: 'Output Alias', type: 'text', placeholder: 'MY_VAR', required: false },
    ]
  },
  'format_date': { 
    label: 'Format Date', category: 'logic', icon: Calendar,
    inputs: [
      { name: 'value', label: 'Timestamp', type: 'text' },
      { name: 'format', label: 'Format', type: 'text', placeholder: 'YYYY-MM-DD', required: false },
    ]
  },

  // --- NOTIFY & OPS ---
  'discord_notify': { 
    label: 'Discord Msg', category: 'notify', icon: MessageSquare,
    inputs: [
      { name: 'webhookUrl', label: 'Webhook URL', type: 'password' },
      { name: 'message', label: 'Message', type: 'textarea' },
    ]
  },
  'telegram_notify': { 
    label: 'Telegram Msg', category: 'notify', icon: MessageSquare,
    inputs: [
      { name: 'botToken', label: 'Bot Token', type: 'password' },
      { name: 'chatId', label: 'Chat ID', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
    ]
  },
  'email_send': { 
    label: 'Send Email', category: 'notify', icon: Mail,
    inputs: [
      { name: 'to', label: 'To Email', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'smtpHost', label: 'SMTP Host', type: 'text' },
      { name: 'smtpUser', label: 'SMTP User', type: 'text' },
      { name: 'smtpPass', label: 'SMTP Pass', type: 'password' },
    ]
  },
  'update_row': { 
    label: 'Update G-Sheet', category: 'ops', icon: FileSpreadsheet,
    inputs: [
      { name: 'colIndex', label: 'Col Index (0=A)', type: 'number', placeholder: '5' },
      { name: 'value', label: 'Value to Write', type: 'text', placeholder: 'Done' },
    ]
  },
};